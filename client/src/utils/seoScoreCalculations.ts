import type { ApiResponse } from "@/types/type";

interface Data {
  analysisData: ApiResponse | null;
}

const missingKeywordScore = (data: Data) => {
  const missingCount = data.analysisData?.message.missing_keywords.length || 0;
  let score = 100;

  if (missingCount <= 2) {
    score = score - missingCount * 10;
  } else if (missingCount <= 5) {
    score = score - 20 + (missingCount - 2) * 15;
  } else {
    score = score - 65 + (missingCount - 5) * 5;
  }

  return Math.max(0, score);
};

const suggestedKeywordScore = (data: Data) => {
  const missingCount = data.analysisData?.message.missing_keywords.length || 0;
  let score = 100;

  if (missingCount <= 2) {
    score = score - missingCount * 10;
  } else if (missingCount <= 5) {
    score = score - 20 + (missingCount - 2) * 15;
  } else {
    score = score - 65 + (missingCount - 5) * 5;
  }

  return Math.max(0, score);
};

export { missingKeywordScore, suggestedKeywordScore };
