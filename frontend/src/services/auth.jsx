import api from './api';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });

  const token = res.data.accessToken;
  const nickname = res.data.nickname;

  localStorage.setItem('token', token);
  localStorage.setItem('nickname', nickname);

  return res.data;
};

export const logout = async (navigate) => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.warn('로그아웃 처리 중 오류 발생', e);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');

    if (navigate) {
      navigate('/login');
    } else {
      window.location.href = '/login';
    }
  }
};

export const requestResetPasswordCode = async (email) => {
  const res = await api.post('/auth/create-code', { email });
  return res.data;
};

export const resetPassword = async ({ email, code, newPassword }) => {
  const res = await api.post('/auth/reset-password', {
    email,
    code,
    newPassword,
  });
  return res.data;
};