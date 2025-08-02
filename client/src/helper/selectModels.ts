export const getSelectedModel = (model: string) => {
  return model && model.trim() ? model : "gemini-2.5-flash";
};