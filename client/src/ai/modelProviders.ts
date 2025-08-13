// helper list for model choosing
export const modelsProvider = [
  {
    modelName: "Gemini-2.5-flash",
    model: "gemini-2.5-flash",
    thinking: "default",
    desc: "Gemini Latest thinking model",
    category: "Thinking Model",
  },
  {
    modelName: "Gemini-2.5-pro",
    model: "gemini-2.5-pro",
    thinking: "default",
    desc: "Gemini Advance thinking model",
    category: "Thinking Model",
  },
  {
    modelName: "Meta-llama-4",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    thinking: "Exp.",
    desc: "Meta Experimental Model",
    category: "Exp",
  },
  {
    modelName: "Moonshot-kimi-k2",
    model: "moonshotai/kimi-k2-instruct",
    thinking: "no",
    desc: "Moonshot AI's advance Model",
    category: "Non-Thinking Model",
  },
];

// web-browser models

export const webModelsProvider = [
  {
    modelName: "OpenAI GPT-120b OSS",
    model: "openai/gpt-oss-120b",
    thinking: "default",
    desc: "Open AI Advance Model",
    category: "Thinking Model",
  },
  {
    modelName: "OpenAI GPT-20b OSS",
    model: "openai/gpt-oss-20b",
    thinking: "no",
    desc: "Open AI Model Small Model",
    category: "Thinking Model",
  },
];
