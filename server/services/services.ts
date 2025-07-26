import dotenv from "dotenv";
import { TavilyExtract } from "@langchain/tavily";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatAnthropic } from "@langchain/anthropic";
dotenv.config();

export const agentTools = new TavilyExtract({
  extractDepth: "advanced",
  includeImages: false,
  format: "text",
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
  } else if (model === "claude-opus-4") {
    agentModel = new ChatAnthropic({
      model: "claude-4-opus-20250514",
      temperature: 0,
    });
  } else {
    agentModel = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
    });
  }

  return agentModel;
}

// export const agentModel = new ChatGoogleGenerativeAI({
//   temperature: 0,
//   model: "gemini-2.5-flash",
//   tags: ["Blogs", "Articles", "Documentations"],
// });
