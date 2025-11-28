import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Tự động gắn token từ localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
