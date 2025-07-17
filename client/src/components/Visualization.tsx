import React, { useEffect } from "react";
import {
  FileText,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Info,
} from "lucide-react";
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
import type { ApiResponse } from "../types/type";
import { TbTooltip } from "react-icons/tb";

interface Props {
  analysisData: ApiResponse | null;
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

const KeywordCard: React.FC<{
  title: string;
  keywords: string[];
  icon: React.ComponentType<never>;
  color: string;
  bgColor: string;
}> = ({ title, keywords, color, bgColor }) => (
  <div className={`${bgColor} border border-gray-700 rounded-xl p-6 shadow-lg`}>
    <div className="flex items-center mb-4">
      {/* <Icon className={`${color} w-6 h-6 mr-3`} /> */}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <span className={`ml-auto ${color} text-sm font-medium`}>
        {keywords?.length} items
      </span>
    </div>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {keywords?.map((k, i) => (
        <div
          key={i}
          className="bg-gray-800 bg-opacity-50 rounded-lg p-3 text-sm text-gray-300 hover:bg-opacity-70 transition-all"
        >
          {k}
        </div>
      ))}
    </div>
  </div>
);

const SEOVisualization: React.FC<Props> = ({ analysisData }) => {
  /** Destroys existing charts and creates new ones whenever data changes */

  useEffect(() => {
    if (!analysisData || !analysisData.message) {
      return;
    }

    const destroy = (id: string) => {
      ChartJS.getChart(id)?.destroy();
    };
    const makeCharts = () => {
      destroy("wordCountChart");
      destroy("keywordChart");
      destroy("seoScoreChart");
      destroy("suggestKeywordsChart");

      //WORD‑COUNT BAR
      const wordCtx = document.getElementById(
        "wordCountChart"
      ) as HTMLCanvasElement;
      if (wordCtx) {
        new ChartJS(wordCtx, {
          type: "bar",
          data: {
            labels: ["Your Blog", "Competitor Blog"],
            datasets: [
              {
                label: "Word Count",
                data: [
                  analysisData?.message?.word_count_comparison.url1_word_count,
                  analysisData?.message?.word_count_comparison.url2_word_count,
                ],
                backgroundColor: ["#3b82f6", "#ef4444"],
                borderColor: ["#1d4ed8", "#dc2626"],
                borderWidth: 2,
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: "Content Length Comparison",
                color: "#9ca3af",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#9ca3af" },
                grid: { color: "#374151" },
              },
              x: {
                ticks: { color: "#9ca3af" },
                grid: { display: false },
              },
            },
          },
        });
      }

      const keyCtx = document.getElementById(
        "keywordChart"
      ) as HTMLCanvasElement;
      const missingKeywords = analysisData?.message?.missing_keywords || [];
      const missingKeywordsPerf =
        analysisData?.message?.performance.missing_keywords_perf || [];

      if (keyCtx) {
        new ChartJS(keyCtx, {
          data: {
            labels: missingKeywords,
            datasets: [
              {
                type: "bar",
                data: missingKeywordsPerf,
                backgroundColor: ["#f59e0b", "#10b981"],
                borderColor: ["#d97706", "#059669"],
                borderWidth: 2,
                label: "Missing Keywords",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#9ca3af", padding: 20 },
              },
              title: {
                display: true,
                text: "Missing SEO Keywords",
                color: "#9ca3af",
              },
            },
          },
        });
      }

      const suggestKey = document.getElementById(
        "suggestKeywordsChart"
      ) as HTMLCanvasElement;
      const suggestedKeywords = analysisData?.message?.suggested_keywords || [];
      const suggestedKeywordsPerf =
        analysisData?.message?.performance.suggested_keywords_perf || [];

      if (suggestKey) {
        new ChartJS(suggestKey, {
          data: {
            labels: suggestedKeywords,
            datasets: [
              {
                type: "bar",
                data: suggestedKeywordsPerf,
                backgroundColor: ["#f59e0b", "#10b981"],
                borderColor: ["#d97706", "#059669"],
                borderWidth: 2,
                label: "Suggested Keywords",
                yAxisID: "Performance",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#9ca3af", padding: 20 },
              },
              title: {
                display: true,
                text: "Suggested SEO Keywords",
                color: "#9ca3af",
              },
            },
          },
        });
      }

      // Score
      const scoreCtx = document.getElementById(
        "seoScoreChart"
      ) as HTMLCanvasElement;
      if (scoreCtx) {
        const yourScore =
          100 - analysisData?.message?.missing_keywords?.length * 5;
        const competitorScore =
          yourScore + analysisData?.message?.suggested_keywords?.length * 3;

        new ChartJS(scoreCtx, {
          type: "doughnut",
          data: {
            labels: [
              "Content Length",
              "Keyword Density",
              "SEO Optimization",
              "Readability",
              "Structure",
            ],
            datasets: [
              {
                label: "SEO Score",
                data: [
                  (analysisData?.message?.word_count_comparison
                    ?.url1_word_count /
                    Math.max(
                      analysisData?.message?.word_count_comparison
                        ?.url1_word_count,
                      analysisData?.message?.word_count_comparison
                        ?.url2_word_count
                    )) *
                    100,
                  yourScore * 0.7,
                  yourScore,
                  yourScore * 0.8,
                  yourScore * 0.9,
                ],
                backgroundColor: "rgba(59, 131, 246, 0.838)",
                borderColor: "#3b82f6",
                borderWidth: 2,
              },
              {
                label: "Competitor Blog",
                data: [
                  (analysisData?.message?.word_count_comparison
                    ?.url2_word_count /
                    Math.max(
                      analysisData?.message?.word_count_comparison
                        .url1_word_count,
                      analysisData?.message?.word_count_comparison
                        ?.url2_word_count
                    )) *
                    100,
                  competitorScore * 0.7,
                  competitorScore,
                  competitorScore * 0.8,
                  competitorScore * 0.9,
                ],
                backgroundColor: "rgba(251, 50, 50, 0.9)",
                borderColor: "#ef4444",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top", labels: { color: "#9ca3af" } },
              title: {
                display: true,
                text: "SEO Performance Comparison",
                color: "#9ca3af",
              },
            },
          },
        });
      }
    };

    makeCharts();
    return () =>
      [
        "wordCountChart",
        "keywordChart",
        "seoScoreChart",
        "suggestKeywordsChart",
      ].forEach(destroy);
  }, [analysisData]);
  console.log("api response ", analysisData);

  return (
    <div className="space-y-8">
      {/* Blog Titles */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-400" />
          Blog Titles Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
            <h4 className="font-medium text-blue-400 mb-2">Your Blog</h4>
            <p className="text-gray-300">
              {analysisData?.message?.meta_info_comparison?.url1_title}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
            <h4 className="font-medium text-purple-400 mb-2">
              Competitor Blog
            </h4>
            <p className="text-gray-300">
              {analysisData?.message?.meta_info_comparison?.url2_title}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
        <div className="h-64">
          <div className="flex items-center justify-center gap-1 flex-row-reverse">
            <div className="tooltip">
              <Info className="h-3.5 w-3.5" />
              <p className="tooltip-content">
                SEO Keyowrds used by competitors, missing in your blog.
              </p>
            </div>
            <h2 className="text-[1.2rem]">Missing SEO Keywords</h2>
          </div>
          <canvas id="keywordChart" />
        </div>
      </div>

      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
        <div className="h-64">
          <div className="flex items-center justify-center gap-1 flex-row-reverse">
            <div className="tooltip">
              <Info className="h-3.5 w-3.5" />
              <p className="tooltip-content">
                Suggested keywords to boost your reach.
              </p>
            </div>
            <h2 className="text-[1.2rem]">Suggested SEO Keywords</h2>
          </div>
          <canvas id="suggestKeywordsChart" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
          <div className="h-64">
            <canvas id="wordCountChart" />
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
          <div className="h-64">
            <canvas id="seoScoreChart" />
          </div>
        </div>
      </div>

      {/* Keyword Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KeywordCard
          title="Your Blog Missing Keywords"
          keywords={analysisData?.message?.missing_keywords ?? []}
          icon={AlertCircle}
          color="text-red-400"
          bgColor="bg-red-900 bg-opacity-20"
        />
        <KeywordCard
          title="Suggested Keywords"
          keywords={analysisData?.message?.suggested_keywords ?? []}
          icon={Lightbulb}
          color="text-green-400"
          bgColor="bg-green-900 bg-opacity-20"
        />
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
          SEO Analysis Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <Metric
            value={
              analysisData?.message?.word_count_comparison?.url1_word_count ?? 0
            }
            label="Your Word Count"
            clr="blue"
          />
          <Metric
            value={
              analysisData?.message?.word_count_comparison?.url2_word_count ?? 0
            }
            label="Competitor Word Count"
            clr="purple"
          />
          <Metric
            value={analysisData?.message?.missing_keywords?.length ?? 0}
            label="Missing Keywords"
            clr="red"
          />
          <Metric
            value={analysisData?.message?.suggested_keywords?.length ?? 0}
            label="Suggested Keywords"
            clr="green"
          />
        </div>
      </div>
    </div>
  );
};

const Metric = ({
  value,
  label,
  clr,
}: {
  value: number;
  label: string;
  clr: string;
}) => (
  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
    <div className={`text-2xl font-bold text-${clr}-400 mb-1`}>{value}</div>
    <div className="text-sm text-gray-300">{label}</div>
  </div>
);

export default SEOVisualization;
