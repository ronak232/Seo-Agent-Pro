export const getSelectedModel = (model: string) => {
  return model && model.trim() ? model : "gemini-2.5-flash";
};

// browser-search helper function
export const getWebSearchSelectedModel = (model: string) => {
  return model && model.trim() ? model : "openai/gpt-oss-120b";
};
