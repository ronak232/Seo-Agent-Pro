import axios from "axios";

export const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  console.error("VITE_BASE_URL is not set in .env! Please add it.");
}

const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : baseUrl, 
});

export default api;
