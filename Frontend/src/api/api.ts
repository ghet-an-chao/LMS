import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // ví dụ
  headers: { 'Content-Type': 'application/json' },
});

export default api;
