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
  };
}
