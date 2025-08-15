import { ThemeContext } from "@/hooks/themeSwitcher";
import { useContext } from "react";

function ThemeButton() {
  const { currentTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      {currentTheme === "dark" ? (
        <button className="cursor-pointer min-h-full" onClick={toggleTheme}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-sun-icon lucide-sun"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </button>
      ) : (
        <button className="cursor-pointer min-h-full" onClick={toggleTheme}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3859ff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-moon-star-icon lucide-moon-star"
          >
            <path d="M18 5h4" />
            <path d="M20 3v4" />
            <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
          </svg>
        </button>
      )}
    </>
  );
}

export default ThemeButton;
