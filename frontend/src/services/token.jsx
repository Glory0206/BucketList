import api from './api';

export const reissueAccessToken = async () => {
  const accessToken = localStorage.getItem('token');

  try {
    const res = await api.post('/auth/token-reissue', {accessToken}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const newAccessToken = res.data;
    localStorage.setItem('token', newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.warn('토큰 재발급 실패:', err);
    throw err;
  }
};