import {
  Search,
  TrendingUp,
  Target,
  Brain,
  BarChart3,
  Zap,
  Globe,
  CheckCircle,
} from "lucide-react";

function SEOToolFeatures() {
  const features = [
    {
      id: 1,
      icon: <Search className="w-8 h-8" />,
      title: "URL Analysis & Competitor Intelligence",
      description:
        "Upload your blog URL and competitor URLs to get comprehensive insights and performance comparisons in real-time",
      gradient: "from-purple-500 to-pink-500",
      stats: "Real-time analysis",
    },
    {
      id: 2,
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced SEO Performance Check",
      description:
        "Deep dive into title comparisons, meta descriptions, and comprehensive SEO health scoring with actionable recommendations",
      gradient: "from-blue-500 to-cyan-500",
      stats: "50+ SEO factors",
    },
    {
      id: 3,
      icon: <Target className="w-8 h-8" />,
      title: "Missing Keywords Discovery",
      description:
        "Interactive charts reveal keyword gaps and opportunities your competitors are ranking for that you're missing",
      gradient: "from-green-500 to-emerald-500",
      stats: "AI-powered insights",
    },
    {
      id: 4,
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Keyword Suggestions",
      description:
        "Smart algorithms analyze search patterns and suggest high-impact keywords tailored to your niche and audience",
      gradient: "from-orange-500 to-red-500",
      stats: "Machine learning driven",
    },
    {
      id: 5,
      icon: <Globe className="w-8 h-8" />,
      title: "Real-Time Content Analysis",
      description:
        "Powered by Tavily for deep URL analysis, extracting and analyzing content structure, readability, and semantic relevance",
      gradient: "from-indigo-500 to-purple-500",
      stats: "Live data extraction",
    },
    {
      id: 6,
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Tracking Dashboard",
      description:
        "Visual analytics with interactive charts showing keyword rankings, traffic potential, and competitive positioning",
      gradient: "from-pink-500 to-rose-500",
      stats: "Interactive visualization",
    },
  ];

  const stats = [
    {
      value: "85%",
      label: "Improve search rankings",
      color: "text-purple-400",
    },
    { value: "3x", label: "Faster keyword research", color: "text-blue-400" },
    {
      value: "92%",
      label: "Accuracy in competitor analysis",
      color: "text-green-400",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto bg-[#191818] pe-2 pb-10 pt-10 ps-2 text-white flex flex-col gap-5">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
          <Zap className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 font-medium">
            AI-Powered SEO Intelligence
          </span>
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Revolutionary SEO Analysis Platform
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Unlock the power of AI-driven SEO insights with real-time competitor
          analysis, keyword gap identification, and performance optimization
          tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-300 transition-colors">
              {feature.title}
            </h3>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {feature.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                {feature.stats}
              </span>
              <CheckCircle className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-purple-300">
            Competitor URL Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Real-time content extraction and analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Title tag optimization suggestions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Meta description performance scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Content structure analysis</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Powered by Tavily API</span>
            </div>
            <p className="text-sm text-gray-400">
              Deep web analysis for comprehensive competitor insights
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-green-300">
            AI-Powered Keyword Intelligence
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Missing keyword gap analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Search volume and difficulty scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Semantic keyword clustering</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Interactive keyword visualization</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-green-400" />
              <span className="font-medium">Large Language Model Driven</span>
            </div>
            <p className="text-sm text-gray-400">
              Smart algorithms identify high-impact opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SEOToolFeatures;
