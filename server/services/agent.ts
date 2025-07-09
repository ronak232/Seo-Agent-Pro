import dotenv from "dotenv";
import { TavilyExtract } from "@langchain/tavily";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
dotenv.config();

export const agentTools = new TavilyExtract({
  extractDepth: "advanced",
  includeImages: false,
});

export const agentModel = new ChatGoogleGenerativeAI({
  temperature: 0,
  model: "gemini-2.5-flash",
  tags: ["Blogs", "Articles", "Documentations"],
});
