import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

// Interceptor para adicionar o Token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@JotaQuali:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
