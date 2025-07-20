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
import { agentModel, agentTools } from "../services/services";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Request, Response } from "express";
import { tool } from "@langchain/core/tools";
import sanitizeHtml from 'sanitize-html';

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
  suggested_keywords: string[];
  performance: {
    missing_keywords_perf: number[];
    suggested_keywords_perf: number[];
  };
  improved_meta_title: string;
}

export async function agent(req: Request, res: Response): Promise<void> {
  const { userUrl, competitorUrl } = req.body;
  try {
    if (!userUrl || !competitorUrl) {
      return;
    }

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
            "Extract all keywords from Article 2. Then, remove any keyword already present in Article 1. The remaining ones are the missing keywords."
          ),
        ],
      },
      { configurable: { thread_id: "23" } }
    );

    const wordCountSchema = z.object({
      htmlContent: z.string().describe("The HTML content of the webpage."),
    });

    const wordCounterTool = tool(
      async ({ htmlContent }) => {
        // 1. Sanitize the HTML to remove scripts, styles, and unwanted tags
        const cleanText = sanitizeHtml(htmlContent, {
          allowedTags: [
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "li",
            "strong",
            "em",
            "b",
            "i",
            "u",
          ],
          allowedAttributes: {},
        });

        // 2. A more robust way to count words, handling various whitespace
        const words = cleanText.match(/\b\w+\b/g) || [];
        return words.length.toString();
      },
      {
        name: "word_counter",
        description:
          "Accurately counts the words in a given HTML content by first cleaning it.",
        schema: wordCountSchema,
      }
    );
    /**
     * Represents the state for a plan execution process, including input, plan steps, past steps, and response.
     *
     * @property {string} input - The current input string. Reducer prioritizes the new value, falling back to the previous or an empty string.
     * @property {string[]} plan - The list of planned steps as strings. Reducer prioritizes the new value, falling back to the previous or an empty array.
     * @property {[string, string][]} pastSteps - An array of tuples representing past steps and their results. Reducer concatenates new steps to the existing array.
     * @property {string} response - The response string. Reducer prioritizes the new value, falling back to the previous value.
     */
    const PlanExecuteState = Annotation.Root({
      input: Annotation<string[]>({
        reducer: (x, y) => y ?? x ?? [],
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
      suggested_keywords: z
        .array(z.string())
        .describe("suggested seo keywords"),
      performance: z.object({
        missing_keywords_perf: z
          .array(z.number())
          .describe("Missing keywords Performance"),
        suggested_keywords_perf: z
          .array(z.number())
          .describe("Suggested keywords Performance"),
      }),
      improved_meta_title: z
        .string()
        .describe("Suggested improved meta title for URL 1."),
    });

    // current state of the agent that define the step to precceds to plans
    // based on the human message
    const plannerPrompt = ChatPromptTemplate.fromTemplate(
      `You are an SEO specialist. Your task is to analyze and compare the two blog contents below and provide a detailed SEO comparison.

        Article 1 Content:
        {url1_content}
            
        Article 2 Content:
        {url2_content}

        **Word Count Data:**
        - Article 1 Word Count: {url1_word_count}
        - Article 2 Word Count: {url2_word_count}
            
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
            
        4. **Performance Scores**
           - For each keyword, provide a realistic performance score based on search volume and competition.
           - For suggested keywords, compare their performance score with that of the missing keywords.

        5. **Meta Title Enhancement**
            - Based on your analysis, suggest a stronger, SEO-optimized meta title for Article 1 that:
            - includes missing or high-ranking keywords
            - improves on clarity, click appeal, and intent match
            
        **Output format**
        Return your response in **valid JSON** strictly matching the following format:
            
        \`\`\`json
        {{
          "message": {{
            "meta_info_comparison": {{
              "url1_title": "string",
              "url2_title": "string"
            }},
            "missing_keywords": ["string"],
            "suggested_keywords": ["string"],
            "word_count_comparison": {{
              "url1_word_count": number,
              "url2_word_count": number
            }},
            "performance": {{
              "missing_keywords_perf": [number],
              "suggested_keywords_perf": [number]
            }},
            "improved_meta_title": string
          }}
        }}
        \`\`\`
      `
    );

    const structuredModelResponse = agentModel.withStructuredOutput(plan);

    const planner = plannerPrompt.pipe(structuredModelResponse);

    const result: Plan = await planner.invoke({
      objective: "Based on your internal knowledge, estimate how impactful each keyword is for SEO (scale 0-100). Higher = better opportunity, and also Analyze the blog's current meta title and suggest improved alternatives with high SEO potential. Consider missing and suggested keywords from the content comparison.",
      url1_content: JSON.stringify(url1content),
      url2_content: JSON.stringify(url2content),
      url1_word_count: undefined,
      url2_word_count: undefined
    });

    // re-plan step
    // why - if the comparison lacks details between the data or content we again let agent to get more deep insight of missing info or any info between your blog and competetior blog

    const response = z.object({
      response: z.string().describe("Response to user"),
    });

    const responseTool = tool(() => {}, {
      name: "response",
      description: "Response to user.",
      schema: response,
    });

    const planTool = tool(() => {}, {
      name: "plan",
      description:
        "This tool is used to plan the steps to follow to extract the missing seo keywords that {userUrl} have in their blogs while comparing with the {competitorUrl} ",
      schema: plan,
    });

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
        url1_word_count: undefined,
        url2_word_count: undefined
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
        return { response: output }; // agent assume it's final response
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

    workflow.compile();

    res.status(200).json({
      message: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("error ", error.message);
    } else {
      console.error("error ", error);
    }
    res.status(500).send("Error");
  }
}
