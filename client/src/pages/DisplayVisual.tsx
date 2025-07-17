import React, { useState } from "react";
import AnalysisForm from "../components/Form";
import SEOVisualization from "../components/Visualization";
import type { ApiResponse } from "../types/type"; // export that interface if you want reuse
import axios from "axios";
import RippleSkeleton from "../components/Skeleton";
import SEOToolSteps from "@/components/SEOToolSteps";

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
      setLoading(false);
    } catch (e) {
      console.error("some ", e.message);
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 mb-10">
        <SEOToolSteps />
        <AnalysisForm
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
        />

        {loading && <RippleSkeleton />}

        {!loading && analysisData && (
          <SEOVisualization analysisData={analysisData} />
        )}
      </main>
    </div>
  );
};

export default SEODashboard;
