import React, { useState } from "react";
import { Search, AlertCircle, Sparkles } from "lucide-react";

interface Props {
  onAnalyze: (url1: string, url2: string) => void;
  loading: boolean;
  error: string | null;
}

const AnalysisForm: React.FC<Props> = ({ onAnalyze, loading, error }) => {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");

  const submit = () => onAnalyze(url1.trim(), url2.trim()); //

  return (
    <>
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-br from-white to-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-8 backdrop-blur-md bg-white/50 p-10 rounded-3xl shadow-2xl border border-white/40 relative z-10">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4" /> AI-Powered Analysis
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Analyze Any Content Instantly
          </h1>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-200/30 to-transparent pointer-events-none z-0" />
      </section>
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Search className="w-5 h-5 mr-2 text-blue-400" />
          Blog URL Comparison
        </h2>
        <form className="flex flex-col gap-2.5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Blog URL
            </label>
            <input
              type="url"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              placeholder="https://your-blog.com/article"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Competitor Blog URL
            </label>
            <input
              type="url"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              placeholder="https://competitor-blog.com/article"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading || !url1 || !url2}
          className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {loading ? "Analyzing Blogs..." : "Compare Blogs"}
        </button>
      </div>
    </>
  );
};

export default AnalysisForm;
