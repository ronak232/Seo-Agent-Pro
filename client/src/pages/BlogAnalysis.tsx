import { useEffect, useRef, useState } from "react";
import { webModelsProvider } from "@/ai/modelProviders";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronsUpDown,
  Cpu,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  ArrowUp,
  LibraryBig,
  SquarePlus,
  Users,
  CircleMinus,
  Sprout,
  Rss,
  CircleStop,
  Sparkles,
} from "lucide-react";
import { getWebSearchSelectedModel } from "@/utils/model";
import api from "@/utils/api";
import { AnalysisResult } from "@/types/type";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BubbleController,
  LineController,
  PieController,
} from "chart.js";
import { getScoreStatus } from "@/utils/calculateStatus";
import { ThinkingPlaceholder } from "@/components/ThinkingPlaceholder";

export interface ScoreCardProps {
  label: string;
  value: number;
  color: string;
}

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  LineController,
  Legend,
  PieController,
  BubbleController
);

const BlogAnalysis: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const [webSearchModel, setWebSearchModel] = useState<string>(
    webModelsProvider[0]?.model || ""
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const [reasoning, setReasoning] = useState<string>("");
  const controllerRef = useRef<AbortController | null>(null);
  const reasoningFinishedRef = useRef<(() => void) | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!prompt.trim()) {
      setError("Please enter a valid blog URL.");
      return;
    }

    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      setResult(null);

      const res = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/analyze`,
        {
          webSearchModel: webSearchModel,
          prompt,
        },
        {
          signal: controllerRef.current.signal,
        }
      );
      const { response, reasoningText, hasReasoning } = await res.data
        .llmResponse;
      const reasoning = reasoningText == null ? "" : String(reasoningText);
      if (reasoningText && hasReasoning) {
        setReasoning(reasoning);
        setShowReasoning(true);

        await new Promise<void>((resolve) => {
          reasoningFinishedRef.current = resolve;
        });

        setShowReasoning(false);
        setTimeout(() => setResult(response), 100);
        setLoading(false);
        reasoningFinishedRef.current = null;
      } else {
        setLoading(false);
        setShowReasoning(false);
        setResult(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err)); // fallback
      }
      setLoading(false);
      setShowReasoning(false);
      reasoningFinishedRef.current = null;
    } finally {
      setPrompt("");
    }
  };

  const handleChange = (value: string) => {
    const backendModel = getWebSearchSelectedModel(value) || "";
    setWebSearchModel(backendModel);
  };

  const handleCancelRequest = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <div className="min-h-screen relative py-30 px-3">
      <div className="max-w-6xl mx-auto text-center">
        <section className="relative py-10 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 rounded-3xl shadow-2xl border-[1px] border-white/40 relative z-10 mb-16">
            <div className="inline-flex items-center gap-2 mt-4 mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4" /> AI-Powered Analysis
            </div>
            <h1 className="text-4xl md:text-5xl mb-3 font-extrabold leading-tight">
              Blog Analysis
            </h1>
            <p className="mb-8 font-medium text-md font-domine">
              Paste your blog URL below to get AI-powered SEO insights and
              improvement suggestions.
            </p>
          </div>
          <div className="flex gap-4 flex-col max-w-4xl mx-auto">
            <div className="relative border-[2px] border-green-400 ring-green-400 focus:ring-green-500 rounded-lg p-2">
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
                        webModelsProvider.find(
                          (m) => m.model === webSearchModel
                        )?.modelName
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

                {!loading ? (
                  <button
                    className="flex items-center justify-center w-8 rounded-lg bg-black hover:bg-orange-600 text-white transition-all duration-200 cursor-pointer min-h-full"
                    onClick={handleAnalyze}
                  >
                    <ArrowUp size="20" />
                  </button>
                ) : (
                  <button
                    onClick={handleCancelRequest}
                    type="submit"
                    className="bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-1 py-1 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                  >
                    <CircleStop color="#ffffff" size="15" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {/* {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )} */}
        {showReasoning && (
          <ThinkingPlaceholder
            reasoning={reasoning}
            onFinished={() => {
              reasoningFinishedRef.current?.();
              reasoningFinishedRef.current = null;
            }}
          />
        )}
        {result && (
          <>
            <h1 className="text-2xl font-semibold mb-4 mt-4">
              Analysis Results
            </h1>

            <div className="p-6 mt-4 rounded-2xl shadow-lg space-y-6 animate-fadeIn">
              <div className="flex flex-col gap-2 text-lg border-[1px] border-gray-300 rounded-lg p-3">
                <div className="flex gap-3">
                  <Users color="#fba441" />
                  <h2 className="text-xl">Target Audience</h2>
                </div>
                <p className="text-sm text-left">{result.target_audience}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ScoreCardDashboard
                  overall_seo_score={result.overall_seo_score}
                  keyword_usage_score={result.keyword_usage_score}
                  content_quality_score={result.content_quality_score}
                />
                <div className="flex flex-col gap-4 item-center border-[1px] border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm">Overall Score</p>
                      <p className="text-3xl">{result?.overall_seo_score}</p>
                      <p
                        className={`text-[16px] font-bold ${
                          getScoreStatus(result.overall_seo_score || 0).color
                        }`}
                      >
                        {getScoreStatus(result.overall_seo_score || 0).status}
                      </p>
                    </div>
                    <div className="-w-8 h-8">
                      <TrendingUp color="#3b82f6" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm">Keyword Usage Score</p>
                      <p className="text-3xl">{result?.keyword_usage_score}</p>
                      <p
                        className={`text-[16px] font-bold ${
                          getScoreStatus(result.keyword_usage_score || 0).color
                        }`}
                      >
                        {getScoreStatus(result.keyword_usage_score || 0).status}
                      </p>
                    </div>
                    <div className="w-8 h-8">
                      <Target color="#10b981" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm">Content Quality Score</p>
                      <p className="text-3xl">
                        {result?.content_quality_score}
                      </p>
                      <p
                        className={`text-[16px] font-bold ${
                          getScoreStatus(result.content_quality_score || 0)
                            .color
                        }`}
                      >
                        {
                          getScoreStatus(result.content_quality_score || 0)
                            .status
                        }
                      </p>
                    </div>
                    <div>
                      <FileText color="#f59e0b" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start border-[1px] border-gray-300 rounded-lg p-4">
                <div className="flex gap-2">
                  <LibraryBig color="#4147fb" />
                  <h2 className="text-lg text-left font-semibold">
                    Headings Feedbacks
                  </h2>
                </div>
                {result.seo_headings_feedback?.map((item, index) => {
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[16px] text-left">{item}</p>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 flex gap-2 item-end flex-col border-[1px] border-gray-300 rounded-lg">
                <div className="flex gap-2">
                  <SquarePlus color="#f72b2b" />
                  <h2 className="text-lg text-left font-semibold">
                    Missing Keyword
                  </h2>
                </div>
                {result?.missing_keywords?.map((item, index) => {
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <CircleMinus
                        color="#e32626"
                        className="mt-0.5 flex-shrink-0"
                        size="10"
                        strokeWidth="1.5"
                      />
                      <p className="text-[16px]">{item}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-2.5 rounded-xl shadow-sm border border-gray-300 p-4">
                <div className="flex items-center mb-3 gap-2">
                  <CheckCircle2 className="text-green-500" />
                  <h3 className="text-lg font-semibold">Feedback</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {result?.feedback?.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {result?.feedback?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[16px] text-left">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t-[1px] border-t-gray-300"></div>
                <div className="flex items-center gap-2 mb-3">
                  <Rss color="#FFDE63" className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Overall Feedback</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {result?.strong_content_feedback?.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {result?.strong_content_feedback?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[16px] text-left">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t-[1px] border-t-gray-300"></div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold">Recommendations</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {result?.recommendation?.length} items
                  </span>
                </div>
                <div className="space-y-4">
                  {result?.recommendation?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[16px] text-left">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4 border-[1px] border-gray-300 rounded-lg p-4">
                <div className="flex gap-2 items-center">
                  <Sprout color="#00ffb3" />
                  <h2 className="text-2xl font-semibold text-left">
                    Tip for good seo ranking
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  {result.industry_tip?.map((item, index) => {
                    return (
                      <div key={index} className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[16px] text-left">{item}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ScoreCardDashboard = ({
  overall_seo_score,
  keyword_usage_score,
  content_quality_score,
}: AnalysisResult) => {
  useEffect(() => {
    const destroy = (id: string) => {
      ChartJS.getChart(id)?.destroy();
    };

    const dashboardData = () => {
      destroy("scores");
      const scores = document.getElementById("scores") as HTMLCanvasElement;

      if (scores) {
        new ChartJS(scores, {
          type: "pie",
          data: {
            labels: ["Overall Score", "Keywords Score", "Content Score"],
            datasets: [
              {
                label: "Score",
                data: [
                  overall_seo_score,
                  keyword_usage_score,
                  content_quality_score,
                ],
                backgroundColor: [
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                  "rgb(255, 205, 86)",
                ],
                borderColor: "#3b82f6",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                labels: {
                  font: {
                    size: 16,
                  },
                },
              },
            },
          },
        });
      }
    };
    dashboardData();
    return () => {
      ["scores"].forEach(destroy);
    };
  }, [overall_seo_score, keyword_usage_score, content_quality_score]);

  return (
    <div className="p-2 border-[1px] border-gray-300 rounded-lg">
      <canvas id="scores" aria-label="score" role="img" />
    </div>
  );
};

export default BlogAnalysis;
