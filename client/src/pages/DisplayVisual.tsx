import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import AnalysisForm from "../components/Form";
import SEOVisualization from "../components/Visualization";
import type { ApiResponse } from "../types/type"; // export that interface if you want reuse
import axios from "axios";

const SEODashboard: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (userUrl: string, competitorUrl: string) => {
    if (!userUrl || !competitorUrl) {
      setError("Please enter both URLs to compare");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/upload", {
        userUrl,
        competitorUrl,
      });
      const data = await res.data;
      setAnalysisData(data);
      setLoading(false)
    } catch (e) {
      console.error("some ", e.message);
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SEO Blog Comparison Tool
            </h1>
          </div>
          <span className="px-4 py-2 bg-green-600 bg-opacity-20 text-green-400 rounded-full text-sm">
            AI Powered
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalysisForm
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
        />
        {loading && analysisData && (
          <SEOVisualization analysisData={analysisData} loading={loading} />
        )}
      </main>
    </div>
  );
};

export default SEODashboard;
