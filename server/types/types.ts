export interface IWebSearchModelResponse {
  overall_seo_score: number;
  keyword_usage_score: number;
  content_quality_score: number;
  feedback: string[] | [];
  recommendation: string[] | [];
  industry_score: string[] | [];
  seo_headings_feedback: string [];
  positive_feedbacks: string[] | [];
  missing_keywords: string[] | []
}
