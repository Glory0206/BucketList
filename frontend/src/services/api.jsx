import axios from 'axios';
import { logout } from '../services/auth';
import { reissueAccessToken } from '../services/token';

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

// 응답 직후 - 토큰 만료 시 재발급
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    const status = err.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await reissueAccessToken();
        console.log('재발급 받은 토큰:', newToken);
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        alert('로그인이 만료되었습니다.');
        logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
