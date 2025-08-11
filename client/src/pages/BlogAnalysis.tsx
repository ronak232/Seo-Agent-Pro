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

interface AnalysisResult {
  seoScore: number;
  keywordScore: number;
  contentQuality: number;
  missingKeywords: string[];
}

interface ScoreCardProps {
  label: string;
  value: number;
  color: string;
}

const BlogAnalysis: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [webSearchmodel, setWebSearchModel] = useState(
    webModelsProvider[0].modelName
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!query.trim()) {
      setError("Please enter a valid blog URL.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // Placeholder for backend call
      // const res = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      // const data = await res.json();
      // setResult(data);

      // Mock data for now
      setTimeout(() => {
        setResult({
          seoScore: 78,
          keywordScore: 65,
          contentQuality: 82,
          missingKeywords: [
            "react hooks",
            "seo tips",
            "page speed optimization",
          ],
        });
        setLoading(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    const currentModel = getWebSearchSelectedModel(value);
    setWebSearchModel(currentModel);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className="min-h-screen relative overflow-hidden py-50 px-3 bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog Analysis</h1>
        <p className="text-gray-400 mb-8">
          Paste your blog URL below to get AI-powered SEO insights and
          improvement suggestions.
        </p>

        <div className="w-full">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              // onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="w-full min-h-[120px] max-h-[200px] resize-none bg-transparent ring-green-400 focus:ring-green-500 text-white placeholder-gray-400 text-base leading-relaxed border p-2 rounded-xl"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />

            <div className="flex items-center justify-end gap-2 left-0 right-0 absolute bottom-2 p-1">
              <div className="flex items-center gap-3">
                <div className="bg-gray-700 rounded-lg p-1 flex gap-2 items-center pt-1 pb-1 border-2 border-gray-400 relative models">
                  <Cpu color="#ffffff" size="15" />
                  <Listbox value={webSearchmodel} onChange={handleChange}>
                    <ListboxButton className="text-[12px] capitalize font-bold min-w-32 w-full text-left flex gap-1.5 items-center justify-evenly focus:outline-0 cursor-pointer">
                      {webSearchmodel}
                      <ChevronsUpDown size="15" className="models-btn" />
                    </ListboxButton>
                    <ListboxOptions className=" flex flex-col gap-1.5 absolute top-8 md:top-10 -right-5 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg max-h-56 overflow-auto model-options focus-within:outline-0 p-4 shadow-lg shadow-zinc-500 text-left">
                      <p className="text-[10px] text-center border-b-[1px] mb-1.5 text-white">
                        Models
                      </p>
                      {webModelsProvider.map((item) => (
                        <ListboxOption
                          key={item.modelName}
                          value={item.modelName}
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
              </div>

              <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-500 hover:bg-orange-600 transition-all duration-200 cursor-pointer">
                <ArrowUp size="20" />
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {result && (
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ScoreCard
                label="SEO Score"
                value={result.seoScore}
                color="text-green-400"
              />
              <ScoreCard
                label="Keyword Score"
                value={result.keywordScore}
                color="text-yellow-400"
              />
              <ScoreCard
                label="Content Quality"
                value={result.contentQuality}
                color="text-blue-400"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Missing Keywords</h3>
              <ul className="list-disc list-inside text-gray-300">
                {result.missingKeywords.map((kw, i) => (
                  <li key={i}>{kw}</li>
                ))}
              </ul>
            </div>
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
