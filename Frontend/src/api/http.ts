import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy token từ localStorage
function getToken() {
  return localStorage.getItem('accessToken');
}

// Interceptor: tự động thêm Authorization vào mọi request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: interceptor xử lý lỗi token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('Token invalid / expired');
      // Có thể logout hoặc refresh token
    }
    return Promise.reject(err);
  }
);

export default api;
