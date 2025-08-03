import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <header className="bg-opacity-50 w-full fixed top-0 left-0 right-0 h-16 z-40 bg-white shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to={"/home"}>
              {/* <TrendingUp className="w-8 h-8 text-blue-400 mr-3" /> */}
              <img
                className="w-20 h-10"
                src="https://res.cloudinary.com/dwc1sjsvj/image/upload/v1754214545/f1pjzukibxzlncqtazw5.png"
                alt="seo-logo"
              />
            </Link>

            <h1 className="text-sm md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
