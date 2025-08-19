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
      seo_headings_feedback: z.array(z.string()).default([]),
      content_feedback: z.array(z.string()).default([]),
      industry_tip: z.array(z.string()).default([]),
      target_audience: z.string().default("")
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
        content: `You are a professional blog editor. who intelligently extract url from 
                  {userQuery} and analyze url content, do research.

                  ⚠️ Rules:
                  - Always include **all properties**.
                  - Never leave arrays empty — always provide at least 1–2 meaningful items.
                  - Never leave strings empty — always provide a clear description.
                  - Scores must be numbers between 0–100.
                  - Do not include raw search results,website page content, or extra info, just analyze it and do not hallacuation for content and give authentic informations.

                  ##Tasks:
                  1. Provide **overall SEO score** (0–100).
                  2. Provide **keyword usage score** (0–100).
                  3. Provide **content quality score** (0–100).
                  4. List **10 missing but relevant keywords** for better Google ranking.
                  5. Provide **overall feedbacks** for content improvement (must include both strengths and weaknesses).
                  6. Provide **recommendations** for title, blog/article body content, and heading usage.
                  7. Identify the **target audience** and suggest **2–3 core topics** the blog should focus on.
                  8. Provide **content feedback for meta description** with strengths, weaknesses, and a **score (0–100)**.
                  9. Provide **feedback on heading structure** of {url}.
                  10. Provide at least **3 industry-level tips** against {url} content.
                  11. Provide at least **6 strong content feedback points** (strengths + weaknesses of current blog).
                  
                  Hack follow for blog post title formulas you can model:
                  “X Easy Ways to [accomplish something]” or 
                  “X [Common problems] with [niche topic] and How to Fix Them” 
                  “The Beginner's Guide to [niche topic]”

                  \`\`\`json
                  {
                    "overall_seo_score": number,
                    "keyword_usage_score": number,
                    "content_quality_score": number,
                    "feedback":string[strong, weak],
                    "recommendation":string[],
                    "missing_keywords":string[],
                    "seo_headings_feedback": string[],
                    "strong_content_feedback":string[],
                    "industry_score": string[],
                    "target_audience": string
                  }                  
                `,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    stop: null,
    tool_choice: "auto",
    include_reasoning: true,
    seed: 1,
    reasoning_effort: "low",
    tools: [
      {
        type: "browser_search",
      },
    ],
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
