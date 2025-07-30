import api from './api';

// 카테고리 생성
export const createCategory = async ({ name, color }) => {
  const res = await api.post('/category', { name, color });
  return res.data;
};

// 카테고리 목록 조회
export const getCategories = async () => {
  const res = await api.get('/category');
  return res.data;
};

// 카테고리 수정
export const updateCategory = async ({ id, name, color }) => {
  const res = await api.put(`/category/${id}`, { name, color });
  return res.data;
};

// 카테고리 삭제
export const deleteCategory = async (id) => {
  const res = await api.delete(`/category/${id}`);
  return res.data;
}; 