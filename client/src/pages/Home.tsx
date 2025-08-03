import SEOToolFeatures from "@/components/SEOToolFeatures";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="text-gray-800 overflow-x-hidden">
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
          <div className="relative w-full max-w-7xl flex items-center justify-center min-h-[880px] mt-15 mb-6">
            <div className="absolute top-10 left-0 md:top-20 md:left-10 lg:left-20 transform -rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105 float-animation">
              <div className="bg-white p-3 rounded-xl shadow-xl w-72">
                <div className="flex items-center mb-3">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="font-bold text-lg">Keyword Opportunities</h3>
                </div>
                <p className="text-gray-600 text-sm font-medium bg-green-50 p-2 rounded-md">
                  + Smart agent that plans tasks
                </p>
                <p className="text-gray-600 text-sm font-medium bg-green-50 p-2 rounded-md mt-2">
                  + Real-time SEO insights from the web
                </p>
                <p className="text-gray-600 text-sm font-medium bg-green-50 p-2 rounded-md mt-2">
                  + Finds missing content to improve ranking
                </p>
              </div>
            </div>
            <div className="hidden md:block absolute top-16 right-0 md:right-10 lg:right-24 transform rotate-4 transition-transform duration-300 hover:rotate-0 hover:scale-105 float-animation">
              <div className="bg-white p-5 rounded-xl shadow-2xl w-72">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">SERP Analysis</h3>
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-sm">
                    Top 10 Avg. Word Count
                  </p>
                  <p className="text-2xl font-bold text-blue-600">2,150</p>
                  <p className="font-semibold text-sm mt-2">Your Article</p>
                  <p className="text-2xl font-bold text-gray-700">900</p>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute bottom-12 left-0 md:left-5 lg:left-16 transform -rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-105 float-animation">
              <div className="bg-white p-5 rounded-xl shadow-2xl w-80">
                <h3 className="font-bold text-lg mb-4">
                  Your Content Score:{" "}
                  <span className="text-green-500">88/100</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Keyword Density</p>
                    <div className="bg-gray-200 h-2 rounded-full mt-1">
                      <div className="bg-green-500 h-2 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Heading Structure</p>
                    <div className="bg-gray-200 h-2 rounded-full mt-1">
                      <div className="bg-green-500 h-2 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Internal Links</p>
                    <div className="bg-gray-200 h-2 rounded-full mt-1">
                      <div className="bg-yellow-500 h-2 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0.5 right-0 md:bottom-20 md:right-10 lg:right-20 transform rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105 float-animation">
              <div className="bg-white p-5 rounded-xl shadow-2xl w-80">
                <h3 className="font-bold text-lg mb-4">Competitor Insights</h3>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="bg-blue-100 p-3 rounded-lg flex items-center justify-center shadow-inner">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold mt-2">Your URL</p>
                  </div>
                  <span className="text-gray-400 font-bold text-xl">vs</span>
                  <div className="text-center">
                    <div className="bg-red-100 p-3 rounded-lg flex items-center justify-center shadow-inner">
                      <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold mt-2">Peer URL</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative text-center z-10">
              <div className="inline-block bg-white p-3 rounded-2xl shadow-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12H9m4 4H9m2-8H9"
                  />
                </svg>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Analyze, Optimize, <br />
                <span className="text-gray-500">Outrank the Competition</span>
              </h1>

              <p className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-gray-600">
                Unlock hidden SEO insights and dominate the SERPs with our
                AI-powered agent.
              </p>

              <div className="mt-4">
                <Link to={"/seo-tool"} className="inline-block">
                  <button className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer">
                    Start Your Free Analysis
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SEOToolFeatures />
    </>
  );
}

export default Home;
