import { Request, Response } from "express";
import { z } from "zod";
import { getSingleBlogAnalysis } from "../services/services";

interface GPTResponse {
  metrics: {
    overall_seo_score: number;
    keyword_score: number;
    content_quality: number;
  };
  feedback: string;
  recommendations: string[];
}

export async function blogAnalysis(req: Request, res: Response): Promise<void> {
  const { webSearchModel, query } = req.body;
  console.log(req.body);

  if (!query) return;

  // analysis
  try {
    const getResponse = await getSingleBlogAnalysis(webSearchModel, query);

    console.log("response ", getResponse);

    res.status(200).json({
      responseData: getResponse,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        mesaage: "Something bad happened",
      });
    }
  }
}
