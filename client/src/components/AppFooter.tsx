import { Link } from "react-router-dom";

function SEOFooter() {
  return (
    <footer className="bg-white backdrop-blur-md shadow-lg mx-auto max-w-full px-2 py-10 text-center animate-fade-in border border-t-gray-300">
      <div className="flex flex-col items-center gap-3">
        <p className="text-4xl font-bold text-blue-700">SEO Tool</p>
        <p className="text-gray-600">
          Design with the least amount of effort starting now.
        </p>
        <div className="flex gap-4 mt-4">
          <Link className="cursor-pointer" to={"/seo-tool"}>
            <button className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default SEOFooter;
