export interface IWebSearchModelResponse {
  oevrall_seo_score: number;
  keyword_usage_score: number;
  content_quality_score: number;
  feedback: string[];
  recommendation: string[];
}
