import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  Annotation,
  END,
  START,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { agentModel, agentTools } from "../services/agent";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Request, Response } from "express";

interface Plan {
  missing_keywords: string[];
  meta_info_comparison: {
    url1_title: string;
    url2_title: string;
  };
  word_count_comparison: {
    url1_word_count: number;
    url2_word_count: number;
  };
}

interface PlanFunction {
  name: string;
  description: string;
  parameters: any;
}

interface PlanTool {
  type: string;
  function: PlanFunction;
}

interface ResponseTool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

export async function agent(req: Request, res: Response): Promise<void> {
  const { userUrl, competitorUrl } = req.body;

  try {
    const [url1content, url2content]: [any, any] = await Promise.all([
      agentTools.invoke({
        urls: [userUrl],
      }),
      agentTools.invoke({
        urls: [competitorUrl],
      }),
    ]);

    // Initialize memory to persist state between graph runs
    const agentCheckpointer = new MemorySaver();

    const agent = createReactAgent({
      llm: agentModel,
      tools: [agentTools],
      checkpointSaver: agentCheckpointer,
    });

    await agent.invoke(
      {
        messages: [
          new HumanMessage(
            "what missing keywords does url1 is missing to compare with url2"
          ),
        ],
      },
      { configurable: { thread_id: "23" } }
    );

    const plan = z.object({
      missing_keywords: z
        .array(z.string())
        .describe("Keywords in URL 2 but not in URL 1."),
      meta_info_comparison: z.object({
        url1_title: z.string().describe("Title of URL 1."),
        url2_title: z.string().describe("Title of URL 2."),
      }),
      word_count_comparison: z.object({
        url1_word_count: z.number().describe("Word count of URL 1."),
        url2_word_count: z.number().describe("Word count of URL 2."),
      }),
    });

    const planFunction: PlanFunction = {
      name: "plan",
      description:
        "This tool is used to plan the steps to follow to extract the missing relevant seo keywords that {userUrl} have in their blogs when comparing with the blog or aricles url-{competitorUrl}",
      parameters: plan,
    };

    const planTool: PlanTool = {
      type: "function",
      function: planFunction,
    };

    // current state of the agent that define the step to preced to plan
    const plannerPrompt = ChatPromptTemplate.fromTemplate(
      `You are an SEO specialist. Your task is to analyze and compare the two blog contents below and provide a detailed SEO comparison.

        Article 1 Content :
        {url1_content} (this urls belongs to user article or blog)
            
        Article 2 Content :
        {url2_content} (this url belongs to competitor article or blog)
            
        Based on your analysis, return the following:
            
        1. **Missing SEO Keywords in Article 1**  
             - Identify high-impact SEO keywords that are present in Article 2 but not in Article 1.  
             - These should be real, rankable search terms or phrases users might use on Google.  
             - Prioritize keywords that improve organic visibility.
            
        2. **Meta Title Comparison**  
             - Extract and compare the meta titles (or infer if not explicitly available).  
             - Provide suggestions to improve Article 1's meta title if it is weaker.
            
        3. **Word Count Comparison**  
             - Count and report the word count of both articles.  
             - Mention if one is significantly longer and whether that benefits SEO.

        4. **Suggest good seo keyowrds alternatives**
                - Provide with good and relevant seo keywords
            
        Make the output structured and concise. List keywords in a bullet list or comma-separated format.
`
    );

    const modelTools = agentModel.withStructuredOutput(plan);

    const planner = plannerPrompt.pipe(modelTools);
    // Now it's time to use!

    const result: Plan = await planner.invoke({
      url1_content: JSON.stringify(url1content),
      url2_content: JSON.stringify(url2content),
    });

    // re-plan step
    // why - if the comparison lacks details between the data or content we again let agent to get more deep insight of missing info or any info between your blog and competetior blog

    const response = z.object({
      response: z.string().describe("Response to user"),
    });

    const responseTool: ResponseTool = {
      type: "function",
      function: {
        name: "response",
        description: "Response to user.",
        parameters: response,
      },
    };

    const replannerPrompt = ChatPromptTemplate.fromTemplate(
      `For the given objective, come up with a simple step by step plan. 
        This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps.
        The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.

        Your objective was this:
        {input}

        Your original plan was this:
        {plan}

        You have currently done the follow steps:
        {pastSteps}

        Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that and use the 'response' function.
        Otherwise, fill out the plan.  
        Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan.`
    );

    const replanner = replannerPrompt.pipe(
      new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
      }).bindTools([planTool, responseTool])
    );

    const PlanExecuteState = Annotation.Root({
      input: Annotation<string>({
        reducer: (x, y) => y ?? x ?? "",
      }),
      plan: Annotation<string[]>({
        reducer: (x, y) => y ?? x ?? [],
      }),
      pastSteps: Annotation<[string, string][]>({
        reducer: (x, y) => x.concat(y),
      }),
      response: Annotation<string>({
        reducer: (x, y) => y ?? x,
      }),
    });

    async function executeStep(
      state: typeof PlanExecuteState.State,
      config?: RunnableConfig
    ): Promise<Partial<typeof PlanExecuteState.State>> {
      const task: string = state.plan[0];
      const { text }: { text: string } = await agentModel.invoke(task, config);

      return {
        pastSteps: [[task, text[text.length - 1]]],
        plan: state.plan.slice(1),
      };
    }

    async function planStep(
      state: typeof PlanExecuteState.State
    ): Promise<Partial<typeof PlanExecuteState.State>> {
      const plan: Plan = await planner.invoke({
        objective: state.input,
        url1_content: undefined,
        url2_content: undefined,
      });
      return { plan: plan.missing_keywords };
    }

    async function replanStep(
      state: typeof PlanExecuteState.State
    ): Promise<Partial<typeof PlanExecuteState.State>> {
      const output: any = await replanner.invoke({
        input: state.input,
        plan: state.plan.join("\n"),
        pastSteps: state.pastSteps
          .map(([step, result]) => `${step}: ${result}`)
          .join("\n"),
      });
      if (typeof output === "string") {
        return { response: output }; // assume it's final response
      }

      // If it's tool output with a structure like { type, args }
      const toolCall = Array.isArray(output) ? output[0] : output;
      if (toolCall.type === "response") {
        return { response: toolCall.args?.response };
      }

      return { plan: toolCall.args?.steps ?? [] };
    }

    function shouldEnd(state: typeof PlanExecuteState.State): "true" | "false" {
      return state.response ? "true" : "false";
    }

    const workflow = new StateGraph(PlanExecuteState)
      .addNode("planner", planStep)
      .addNode("agent", executeStep)
      .addNode("replan", replanStep)
      .addEdge(START, "planner")
      .addEdge("planner", "agent")
      .addEdge("agent", "replan")
      .addConditionalEdges("replan", shouldEnd, {
        true: END,
        false: "agent",
      });

    // Finally, we compile it!
    // This compiles it into a LangChain Runnable,
    // meaning you can use it as you would any other runnable
    workflow.compile();
    res.status(200).json({
      message: result,
    });
  } catch (error) {
    res.status(500).send("Error");
  }
}
