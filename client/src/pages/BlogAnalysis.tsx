import { useEffect, useRef, useState } from "react";
import { webModelsProvider } from "@/ai/modelProviders";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronsUpDown, Cpu } from "lucide-react";
import { getWebSearchSelectedModel } from "@/helper/selectModels";
import { ArrowUp } from "lucide-react";
import api from "@/utils/api";
import { AnalysisResult } from "@/types/type";

export interface ScoreCardProps {
  label: string;
  value: number;
  color: string;
}

const BlogAnalysis: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [webSearchModel, setWebSearchModel] = useState<string>(
    webModelsProvider[0]?.model || ""
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!prompt.trim()) {
      setError("Please enter a valid blog URL.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await api.post(`http://localhost:5000/api/v1/analyze`, {
        webSearchModel: webSearchModel,
        prompt,
      });
      const data = await res.data.responseData;
      setLoading(false);
      setResult(data);

      // Mock data for now
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err)); // fallback
      }
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    const backendModel = getWebSearchSelectedModel(value) || "";
    setWebSearchModel(backendModel);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="min-h-screen relative overflow-hidden py-30 px-3">
      <div className="max-w-6xl mx-auto text-center">
        <section className="relative overflow-hidden py-10 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-accent pb-3 leading-tight">
              Blog Analysis
            </h1>
            <p className="text-cyan-600 mb-8 font-medium text-md font-domine">
              Paste your blog URL below to get AI-powered SEO insights and
              improvement suggestions.
            </p>
          </div>
        </section>

        <div className="relative max-w-3xl mx-auto border-[2px] border-green-400 ring-green-400 focus:ring-green-500 rounded-lg p-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question..."
            className="w-full min-h-[10px] max-h-[200px] resize-none bg-transparent focus:outline-0 placeholder-gray-400 font-medium text-base leading-relaxed p-2 rounded-xl"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          />

          <div className="flex items-stretch justify-end gap-2 p-1 h-full">
            <div className="bg-black/90 rounded-lg p-1 flex gap-2 items-center border-[1px] border-gray-100 relative models h-full hover:bg-black/85">
              <Cpu color="#ffffff" size="15" />
              <Listbox value={webSearchModel} onChange={handleChange}>
                <ListboxButton className="text-[12px] capitalize min-w-32 w-full text-left flex gap-1.5 items-center justify-evenly focus:outline-0 cursor-pointer font-sans font-medium text-white">
                  {
                    webModelsProvider.find((m) => m.model === webSearchModel)
                      ?.modelName
                  }
                  <ChevronsUpDown size="15" className="models-btn" />
                </ListboxButton>
                <ListboxOptions className=" flex flex-col gap-1.5 absolute top-6 md:top-6 -right-5 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg min-h-full overflow-auto model-options focus-within:outline-0 p-4 shadow-sm text-left">
                  <p className="text-[10px] text-center border-b-[1px] mb-1.5 text-white">
                    Models
                  </p>
                  {webModelsProvider.map((item) => (
                    <ListboxOption
                      key={item.modelName}
                      value={item.model}
                      className="hover:bg-gray-500 cursor-pointer border-b-[1px] border-gray-400 p-1"
                    >
                      <div>
                        <span className="font-semibold text-white text-[12px]">
                          {item.modelName}
                        </span>
                        <div className="badge badge-xs ms-1">
                          {item.category === "" ? "" : item.category}
                        </div>
                        <span className="block text-xs text-gray-400">
                          {item.desc}
                        </span>
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            </div>

            <button
              className="flex items-center justify-center w-8 rounded-lg bg-black hover:bg-orange-600 text-white transition-all duration-200 cursor-pointer min-h-full"
              onClick={handleAnalyze}
            >
              <ArrowUp size="20" />
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-6 mt-4 rounded-2xl shadow-lg space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ScoreCard
                label="SEO Score"
                value={result.overall_score}
                color="text-green-400"
              />
              <ScoreCard
                label="Keyword Score"
                value={result.keyword_score}
                color="text-yellow-400"
              />
              <ScoreCard
                label="Content Quality"
                value={result.content_quality}
                color="text-blue-400"
              />
            </div>
            {/* 
            <div>
              <h3 className="text-lg font-semibold mb-2">Missing Keywords</h3>
              <ul className="list-disc list-inside text-gray-300">
                {result.map((item, i) => (
                  <li key={i}>{item.overall_score}</li>
                ))}
              </ul>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

const ScoreCard: React.FC<ScoreCardProps> = ({ label, value, color }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}%</p>
    </div>
  );
};

export default BlogAnalysis;
