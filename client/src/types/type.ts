export interface ApiResponse {
  message: {
    meta_info_comparison: {
      url1_title: string;
      url2_title: string;
    };
    missing_keywords: string[];
    suggested_keywords: string[];
    word_count_comparison: {
      url1_word_count: number;
      url2_word_count: number;
    };
    performance: {
      missing_keywords_perf: string[];
      suggested_keywords_perf: string[];
    };
    improved_meta_title: string;
  };
}

export interface AnalysisResult {
  overall_seo_score?: number;
  keyword_usage_score?: number;
  content_quality_score?: number;
  overall_feedback?: {
    pros: { content: string[] };
    cons: { content: string[] };
  };
  meta_description_feedback?: {
    pros?: string[] | [];
    cons?: string[] | [];
    score?: number | 0;
    recommended_score?: number | 0;
  };
  industry_tips?: string[] | [];
  heading_recommendations?: string[] | [];
  body_recommendations?: string[] | [];
  title_recommendations?: string[] | [];
  missing_keywords?: string[] | [];
  target_audience?: string;
}

export interface ModelProps {
  category?: string;
  desc?: string;
  model?: string;
  modelName?: string;
  thinking?: boolean;
}
