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

// tool to handle single blog analysis
export async function getSingleBlogAnalysis(
  webSearchmodel: string,
  userQuery: string
) {
  const responsSchema = z
    .object({
      overall_seo_score: z.number(),
      keyword_usage_score: z.number(),
      content_quality_score: z.number(),
      feedback: z.array(z.string()),
      recommendation: z.array(z.string()),
    })
    .describe("");

  // type ModelSchema = z.infer<typeof responsSchema>;

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
                  7. Understand target audience and identify 2-3 core topics blog will focus on.
                  8. heading structure improvement and seo heading feedback

                  Hack follow for blog post title formulas you can model:

                  “X Easy Ways to [accomplish something]” or “X [Common problems] with [niche topic] and How to Fix Them” or “The Beginner's Guide to [niche topic]”
                  
                  In response never add irrelevant infomations like page content, just analyze it and also add in response below points in json format and do not hallacuation for content
                  {
                    "overall_seo_score": number,
                    "keyword_usage_score": number,
                    "content_quality_score": number,
                    "feedback":string[],
                    "recommendation":string[]
                  }
                `,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    stop: null,
    tool_choice: "auto",
    reasoning_effort: "medium",
    tools: [
      {
        type: "browser_search",
      },
    ],

    reasoning_format: "parsed",
    // response_format: {
    //   type: "json_schema",
    //   json_schema: {
    //     name: "response",
    //     schema: z.toJSONSchema(responsSchema),
    //   },
    // },
  });

  const response = chatCompletion.choices[0]?.message.content;
  console.log("response ", response);

  return response;
}
