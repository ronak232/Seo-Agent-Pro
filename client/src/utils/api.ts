import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

if (!baseUrl) {
  console.error("VITE_BASE_URL is not set in .env! Please add it.");
}

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
