import dotenv from "dotenv";
import { TavilyExtract } from "@langchain/tavily";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { Groq } from "groq-sdk";
import * as z from "zod";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API || "",
});

export const agentTool = new TavilyExtract({
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

// tool to handle single blog analysis
export async function getSingleBlogAnalysis(
  webSearchmodel: string,
  userQuery: string
) {
  const responseSchema = z
    .object({
      overall_seo_score: z.number().default(0),
      keyword_usage_score: z.number().default(0),
      content_quality_score: z.number().default(0),
      feedback: z.array(z.string()).default([]),
      recommendation: z.array(z.string()).default([]),
      missing_keywords: z.array(z.string()).default([]),
      seo_heading_feedback: z.array(z.string()).default([]),
    })
    .describe("Ai json response");

  const chatCompletion = await groq.chat.completions.create({
    model: webSearchmodel,
    messages: [
      {
        role: "user",
        content: userQuery,
      },
      {
        role: "system",
        content: `You are an SEO assistant. Intelligently extract url from 
                  {userQuery} and analyze it do research the following blog content and give:
                  1. Overall SEO score (0-100)
                  2. Keyword usage score (0-100)
                  3. Content quality score (0-100)
                  4. List 5 missing but relevant keywords for better Google ranking
                  5. Feedback for content missing gap improvement
                  6. Recommendation for quality and overall content like title, blog or article body content, heading usages
                  7. Understand the target audience and identify 2-3 core topics the blog will focus on
                  8. meta title of blog feedback
                  9. heading structure improvement and seo heading feedback
                  10. If 

                  Hack follow for blog post title formulas you can model:

                  “X Easy Ways to [accomplish something]” or “X [Common problems] with [niche topic] and How to Fix Them” or “The Beginner's Guide to [niche topic]”

                  Do not include raw search results,website page content, or extra info., just analyze it and do not hallacuation for content
                  Please respond with only valid JSON in the following format
                  \`\`\`json
                  {
                    "overall_seo_score": number,
                    "keyword_usage_score": number,
                    "content_quality_score": number,
                    "feedback":string[],
                    "recommendation":string[],
                    "missing_keywords":string[],
                    "seo_heading_feedback": string[],
                  }                  
                `,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    stop: null,
    tool_choice: "auto",
    search_settings: {},

    reasoning_effort: "low",
    tools: [
      {
        type: "browser_search",
      },
    ],

    reasoning_format: "parsed",
  });
  let response;
  let rawResponse = chatCompletion.choices[0].message.content ?? "";
  try {
    let getJson = extractJsonFromString(rawResponse);
    response = responseSchema.parse(getJson);
    return response;
  } catch (error) {
    throw new Error("Response did not match ");
  }
}

function extractJsonFromString(data: string) {
  const regex = /[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/gis;
  const matches = data?.match(regex) ?? [];
  return Object.assign({}, ...matches.map((m) => JSON.parse(m)));
}
