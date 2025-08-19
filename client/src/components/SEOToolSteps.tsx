import { Link, Search, BarChart3, ArrowRight } from "lucide-react";

const SEOToolSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Enter URLs",
      description: "Add your blog URL and competitor URLs",
      icon: <Link className="w-6 h-6" />,
      action: "Paste your website URL and up to 3 competitor URLs",
    },
    {
      id: 2,
      title: "Start Analysis",
      description: "Click analyze to begin SEO comparison",
      icon: <Search className="w-6 h-6" />,
      action: "Our AI will analyze content and extract SEO data",
    },
    {
      id: 3,
      title: "Review Results",
      description: "Get insights, keyword gaps, and recommendations",
      icon: <BarChart3 className="w-6 h-6" />,
      action: "View charts, missing keywords, and improvement suggestions",
    },
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How to Use Our SEO Tool
          </h2>
          <p className="text-lg">
            Simple 4-step process to analyze your SEO performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Card */}
              <div className="bg-[#578FCA] rounded-lg p-6 h-full hover:border-purple-500/50 transition-colors">
                {/* Step Number */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-[#F4D160] rounded-full flex items-center justify-center font-bold mr-3">
                    {step.id}
                  </div>
                  <div className="text-[#F4D160]">{step.icon}</div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className=" mb-4 font-semibold text-white">{step.description}</p>
                <p className="text-sm text-white">{step.action}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-7 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-purple-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-[#578FCA] rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4 text-white">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">
                  SEO Performance Score
                </h4>
                <p className="text-white text-sm">
                  Comprehensive analysis of your website's SEO health
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Keyword Gap Analysis
                </h4>
                <p className="text-white text-sm">
                  Find keywords your competitors rank for but you don't
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  AI Recommendations
                </h4>
                <p className="text-white text-sm">
                  Smart suggestions to improve your search rankings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOToolSteps;
