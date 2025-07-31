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

let isRefreshing = false;
let refreshTokenPromise = null;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    const status = err.response?.status;

    // 인증 실패 + 재시도 안 한 요청만 처리
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 재발급 중이면 큐에 담고 기다리기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (error) => {
              reject(error);
            },
          });
        });
      }

      isRefreshing = true;

      // 실제 재발급 시도
      try {
        const newToken = await reissueAccessToken();
        localStorage.setItem('token', newToken);

        processQueue(null, newToken); // 대기 중인 요청 처리
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // 현재 요청 재시도
      } catch (e) {
        processQueue(e, null); // 대기 중인 요청 모두 실패 처리
        logout();
        alert('로그인이 만료되었습니다.');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
