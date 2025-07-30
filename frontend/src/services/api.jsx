import axios from 'axios';
import { logout } from '../utils/auth';
import { goTo } from '../utils/navigate';

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

// ✅ 응답 직후 - 토큰 만료 시 자동 로그아웃
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      logout();
    }
    return Promise.reject(err);
  }
);

export default api;
