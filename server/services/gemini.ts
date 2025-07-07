import { GoogleGenAI, GoogleGenAIOptions, Type } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

export class GenerativeModal {
  #model = "";
  #apiKey = "";
  gemini: GoogleGenAI;
  constructor({ model, apiKey}: { model: string; apiKey: string}) {
    this.#model = model;
    this.#apiKey = apiKey;
    this.gemini = new GoogleGenAI({
      apiKey: this.#apiKey,
    });
  }

  run = async (prompt: String) => {
    
    const llm = await this.gemini.models.generateContent({
      model: this.#model,
      contents: [
        `Let me know what needs to taken care of considering weather and commute. ${prompt} in json format`,
      ],
      config: {
        systemInstruction: "You are agent to help with user queries",
        tools: [
          { urlContext: {} },
          { googleSearch: {} },
        ],
        temperature: 0,
      },
    });
    if (llm.functionCalls && llm.functionCalls.length > 1) {
      const functionCall = llm.functionCalls[0]; // Assuming one function call
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
    }
    const content =
      llm?.candidates && llm.candidates.length > 0
        ? llm.candidates[0].content
        : "";
    console.log("response from gemini ", content);
    return content;
  };
}

export const toolSchema: GoogleGenerativeAIToolType = {
  type: "function",
  function: {
    name: "get_items",
    description: "Use this tool to look up which items are in the given place.",
    parameters: {
      type: "object",
      properties: {
        place: {
          type: "string",
        },
      },
      required: ["place"],
    },
  },
};
