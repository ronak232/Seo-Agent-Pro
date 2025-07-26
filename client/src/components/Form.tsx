import React, { useState } from "react";
import { Search, AlertCircle, Sparkles } from "lucide-react";
import { CircleStop } from "lucide-react";
import { Cpu } from "lucide-react";
import { ArrowBigUp } from "lucide-react";
import { modelsProvider } from "@/ai/modelProviders";
import { getSelectedModel } from "@/helper/selectModels";

interface Props {
  onAnalyze: (url1: string, url2: string, model: string) => void;
  loading: boolean;
  error: string | null;
  onCancelRequest: () => void;
}

const AnalysisForm: React.FC<Props> = ({
  onAnalyze,
  loading,
  error,
  onCancelRequest,
}) => {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [model, setModel] = useState("");

  const handleChangeModel = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setModel(e.target.value);
  };

  const submit = () => {
    const selectedModel = getSelectedModel(model);
    onAnalyze(url1.trim(), url2.trim(), selectedModel);
  }; //

  return (
    <>
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-br from-white to-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-8 backdrop-blur-md bg-white/50 p-10 rounded-3xl shadow-2xl border border-white/40 relative z-10">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4" /> AI-Powered Analysis
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-600 leading-tight">
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

        <div className="flex gap-2 items-center mt-3.5 justify-self-end">
          <div className="flex gap-1.5 items-center bg-sky-800 rounded-lg p-1">
            <Cpu color="#ffffff" size="15" />
            <select
              tabIndex={0}
              className="dropdown-content menu rounded-box z-1 w-full p-0 focus:outline-0 text-[12px]"
              onChange={handleChangeModel}
            >
              {modelsProvider.map((item) => {
                return (
                  <option
                    key={item.modelName}
                    className="sm:text-[10px] cursor-pointer text-base-100 flex flex-col"
                    value={item.modelName}
                  >
                    {item.modelName}
                  </option>
                );
              })}
            </select>
          </div>
          {!loading ? (
            <button
              className="bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-1 py-1 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
              type="submit"
              disabled={loading || !url1 || !url2}
              onClick={submit}
            >
              <ArrowBigUp color="#ffffff" size="19" />
            </button>
          ) : (
            <button
              onClick={onCancelRequest}
              type="submit"
              className="bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-1 py-1 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              <CircleStop color="#ffffff" size="15" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalysisForm;
