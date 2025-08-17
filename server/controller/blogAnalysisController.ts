import { Request, Response } from "express";
import { getSingleBlogAnalysis } from "../services/services";

export async function blogAnalysis(req: Request, res: Response): Promise<void> {
  const { webSearchModel, prompt } = req.body;
  console.log(req.body);

  if (!prompt) return;

  // analysis
  try {
    const getResponse = await getSingleBlogAnalysis(webSearchModel, prompt);

    res.status(200).json({
      responseData: getResponse,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("error response ", error.message);
      res.status(500).json({
        success: false,
        message: "AI response failed",
        error: error?.message ?? "Unknown error",
      });
    }
  }
}
