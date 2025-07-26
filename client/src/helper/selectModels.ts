export const getSelectedModel = (model: string) => {
  return model && model.trim() ? model : "gemini-embedding-001";
};