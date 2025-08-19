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
        content: `You are a professional blog editor. Intelligently extract the URL from {userQuery} and analyze the URL content. Research the blog content and provide ALL of the following information:

**REQUIRED ANALYSIS POINTS:**
1. Overall SEO score (0-100)
2. Keyword usage score (0-100) 
3. Content quality score (0-100)
4. Meta description feedback with score (0-100)
5. List exactly 5 missing but relevant keywords for better Google ranking
6. Provide exactly 6 content improvement recommendations
7. Identify 2-3 core topics the blog should focus on based on target audience
8. List exactly 6 strong content feedback points about the current blog
9. Provide SEO headings structure feedback
10. Give exactly 5 industry-level tips specific to the content
11. Identify the primary target audience

**Title Formula Examples:**
- "X Easy Ways to [accomplish something]"
- "X [Common problems] with [niche topic] and How to Fix Them" 
- "The Beginner's Guide to [niche topic]"

**CRITICAL INSTRUCTIONS:**
- Do NOT include raw search results or website page content
- Provide authentic analysis only - no hallucination
- Your response MUST be ONLY valid JSON
- Include ALL properties listed in the JSON schema below
- DO NOT include markdown code blocks or any text outside the JSON

**REQUIRED JSON FORMAT - YOU MUST INCLUDE ALL THESE PROPERTIES:**

{
  "overall_seo_score": number,
  "keyword_usage_score": number,
  "content_quality_score": number,
  "meta_description_score": number,
  "missing_keywords": [exactly 5 strings],
  "content_recommendations": [exactly 6 strings],
  "core_topics": [2-3 strings],
  "strong_content_feedback": [exactly 6 strings],
  "seo_headings_feedback": [array of strings],
  "industry_tips": [exactly 5 strings],
  "target_audience": "string describing primary audience"
}

RESPOND WITH ONLY THE JSON OBJECT ABOVE. NO OTHER TEXT OR FORMATTING.                
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
