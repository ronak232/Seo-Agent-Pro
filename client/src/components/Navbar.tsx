import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <header className="bg-opacity-50 w-full fixed top-0 left-0 right-0 h-16 z-40 bg-white shadow-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="hidden md:navbar shadow-2xs">
            <div className="flex items-center w-full">
              <Link className="text-[14px]" to={"/home"}>
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
            <nav className="flex w-full">
              <ul className="rounded-box z-1 mt-1 w-full p-1 text-black flex gap-2 items-center justify-end">
                <li className="">
                  <Link className="text-[14px] font-domine" to={"/content-optimizer"}>
                    Content Gap
                  </Link>
                </li>
                <li>
                  <Link className="text-[14px] font-domine" to={"/compare"}>
                    Compare Blog
                  </Link>
                </li>
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
            <div className="dropdown dropdown-bottom dropdown-end text-base-300">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
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
                className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link className="text-[16px]" to={"/content-optimizer"}>
                    AI Content Check
                  </Link>
                </li>
                <li>
                  <Link className="text-[16px]" to={"/compare"}>
                    Compare Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
