// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

// tự động gắn token từ localStorage (do trang login lưu vào đó)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // nhớ trùng key với trang login
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
