import axios from "axios";

export const baseUrl = import.meta.env.VITE_APP_BASE_URL;
console.log("base url ", baseUrl);

if (!baseUrl) {
  console.error("VITE_BASE_URL is not set in .env! Please add it.");
}

const api = axios.create({
  baseURL: import.meta.env.PROD ? baseUrl : "/api",
});

export default api;
