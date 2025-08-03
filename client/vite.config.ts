import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base_url = env.VITE_APP_BASE_URL;

  return {
    base: "/Seo-Agent-Pro/",
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
      cors: {
        origin: "https://seo-agent-pro-1.onrender.com",
      },
      port: 5173,
      proxy: {
        "/api": {
          target: base_url,
          changeOrigin: true, 
        },
      },
      plugins: [react(), tailwindcss(), tsconfigPaths()],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
