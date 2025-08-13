import { useRef, useState } from "react";
import AnalysisForm from "../components/Form";
import SEOVisualization from "../components/Visualization";
import type { ApiResponse } from "../types/type"; // export that interface if you want reuse
import RippleSkeleton from "../components/Skeleton";
import SEOToolSteps from "@/components/SEOToolSteps";
import api from "@/utils/api";

const SEODashboard: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = async (
    userUrl: string,
    competitorUrl: string,
    model: string
  ) => {
    if (!userUrl || !competitorUrl) {
      setError("Please enter both URLs to compare");
      return;
    }
    setLoading(true);
    setError(null);

    controllerRef.current = new AbortController();

    try {
      const res = await api.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/v1/upload`,
        {
          userUrl,
          competitorUrl,
          model,
        },
        {
          signal: controllerRef.current.signal,
        }
      );
      const data = await res.data;
      setAnalysisData(data);
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        console.error("some ", e.message);
        setError(e instanceof Error ? e.message : "Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 mb-10">
        <AnalysisForm
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
          onCancelRequest={handleCancelRequest}
        />

        {loading && <RippleSkeleton />}

        {!loading && analysisData && (
          <SEOVisualization analysisData={analysisData} />
        )}
        <SEOToolSteps />
      </main>
    </div>
  );
};

export default SEODashboard;
