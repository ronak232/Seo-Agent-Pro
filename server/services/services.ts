import dotenv from "dotenv";
import { TavilyExtract } from "@langchain/tavily";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { Groq } from "groq-sdk";

dotenv.config();

export const agentTools = new TavilyExtract({
  extractDepth: "advanced",
  includeImages: false,
  format: "markdown",
});

export function getModelName(model: string) {
  let agentModel;
  if (model === "gemini-2.5-flash") {
    agentModel = new ChatGoogleGenerativeAI({
      temperature: 0,
      model: "gemini-2.5-flash",
      tags: ["Blogs", "Articles", "Documentations"],
    });
  } else if (model === "gemini-2.5-pro") {
    agentModel = new ChatGoogleGenerativeAI({
      temperature: 0,
      model: "gemini-2.5-pro",
      tags: ["Blogs", "Articles", "Documentations"],
    });
  } else if (model === "Meta-llama-4") {
    agentModel = new ChatGroq({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      temperature: 0,
    });
  } else if (model === "Moonshot-kimi") {
    agentModel = new ChatGroq({
      model: "moonshotai/kimi-k2-instruct",
      temperature: 0,
      tags: ["Blogs", "Articels"],
    });
  } else {
    agentModel = new ChatGoogleGenerativeAI({
      temperature: 0,
      model: "gemini-2.0-flash",
      tags: ["Blogs", "Articles", "Documentations"],
    });
  }
  return agentModel;
}

export async function getBlogAnalysisModel(
  model: string,
  userQuery: string
) {
  const groq = new Groq();

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userQuery,
      },
    ],
    model: model,
    temperature: 1,
    top_p: 1,
    stop: null,
    tools: [
      {
        type: "function",
        function: {
          name: "browser_search",
          description: "Searches the web for up-to-date information.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query.",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    stream: true,
    reasoning_format: "parsed",

  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}
