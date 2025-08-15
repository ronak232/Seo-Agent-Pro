import ThemeButton from "@/ui/themebutton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`${
          isScrolled
            ? "bg-black/80 border-b border-white/20 shadow-lg"
            : "bg-black/90"
        } bg-opacity-50 w-full fixed top-0 left-0 right-0 h-16 z-40 `}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="hidden md:navbar shadow-2xs">
            <div className="flex items-center w-full">
              <Link className="text-[14px]" to={"/home"}>
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
            <nav className="flex items-center w-full relative gap-2">
              <ul className="rounded-box z-1 w-full flex gap-2 items-center text-white justify-end">
                <li className="font-semibold">
                  <Link
                    className="text-[14px] font-lato"
                    to={"/content-optimizer"}
                  >
                    Content Gap
                  </Link>
                </li>
                <li className="font-semibold">
                  <Link className="text-[14px] font-lato" to={"/compare"}>
                    Compare Blog
                  </Link>
                </li>
                <ThemeButton />
              </ul>
            </nav>
          </div>
          <div className="navbar shadow-sm sm:hidden">
            <div className="flex items-center w-full">
              <Link className="text-[14px]" to={"/home"}>
                {/* <TrendingUp className="w-8 h-8 text-blue-400 mr-3" /> */}
                <img
                  className="w-20 h-10"
                  src="https://res.cloudinary.com/dwc1sjsvj/image/upload/v1754214545/f1pjzukibxzlncqtazw5.png"
                  alt="seo-logo"
                />
              </Link>
              <h1 className="text-[18px] font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SEO Online Tool
              </h1>
            </div>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-primary btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />{" "}
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-black rounded-box z-1 mt-3 w-80 p-2 shadow gap-2 text-inherit"
              >
                <li>
                  <Link className="text-[20px]" to={"/content-optimizer"}>
                    AI Content Check
                  </Link>
                </li>
                <li>
                  <Link className="text-[20px]" to={"/compare"}>
                    Compare Blog
                  </Link>
                </li>
                <span className="border-t-[1px] border-gray-700 pt-2">
                  <ThemeButton />
                </span>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
