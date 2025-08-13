import { createContext, ReactNode, useEffect, useState } from "react";

interface IThemeProvider {
  currentTheme: string;
  toggleTheme: () => void;
}

export interface ThemeProviderInterface {
  children: ReactNode[] | ReactNode;
}

const ThemeContext = createContext({} as IThemeProvider);

const ThemeProvider = ({ children }: ThemeProviderInterface) => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("currentTheme") || "light"
  );

  const toggleTheme = () => {
    if (currentTheme === "light") {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("light");
    }
  };

  useEffect(() => {
    if (currentTheme) {
      localStorage.setItem("currentTheme", currentTheme);
    }
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
