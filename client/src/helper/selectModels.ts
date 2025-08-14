export const getSelectedModel = (model: string) => {
  return model && model.trim() ? model : "gemini-2.5-flash";
};

// browser-search helper function
export const getWebSearchSelectedModel = (model?: string) => {
  console.log("model ", model)
  return model?.model?.trim() || "openai/gpt-oss-120b";
};
