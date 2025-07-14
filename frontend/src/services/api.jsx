import axios from 'axios';

// API 요청을 보낼 때마다 /api 자동 추가
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// 요청 직전에 자동 실행
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) { // 로컬 스토리지에 저장된 토큰이 있다면
    config.headers.Authorization = `Bearer ${token}`; // 요청 헤더에 토큰을 붙임
  }
  return config;
});

export default api;
