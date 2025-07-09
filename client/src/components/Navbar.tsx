import { TrendingUp } from "lucide-react";

function Navbar() {
  return (
    <>
      {/* Header */}
      <header className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SEO Online Tool
            </h1>
          </div>
          <span className="px-4 py-2 bg-green-600 bg-opacity-20 text-white rounded-full text-sm">
            AI Powered
          </span>
        </div>
      </header>
    </>
  );
}

export default Navbar;
