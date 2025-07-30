import api from './api';

// 전체 버킷리스트 조회
export const getAllBuckets = async () => {
  const res = await api.get('/bucket');
  return res.data;
};

// 미완료 버킷리스트 조회
export const getIncompletedBuckets = async () => {
  const res = await api.get('/bucket/incompleted');
  return res.data;
};

// 완료된 버킷리스트 조회
export const getCompletedBuckets = async () => {
  const res = await api.get('/bucket/completed');
  return res.data;
};

// 버킷리스트 생성
export const createBucket = async ({ content, categoryId, dueDate }) => {
  const res = await api.post('/bucket', { 
    content, 
    categoryId,
    dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null 
  });
  return res.data;
};

// 버킷리스트 수정
export const updateBucket = async ({ id, content, categoryId, dueDate }) => {
  const res = await api.put(`/bucket/${id}`, {
    content,
    categoryId,
    dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null
  });
  return res.data;
};

// 버킷리스트 삭제
export const deleteBucket = async (id) => {
  const res = await api.delete(`/bucket/${id}`);
  return res.data;
};

// 버킷리스트 완료 처리
export const completeBucket = async (id) => {
  const res = await api.put(`/bucket/${id}/complete`);
  return res.data;
};

// 버킷리스트 미완료 처리
export const uncompleteBucket = async (id) => {
  const res = await api.put(`/bucket/${id}/uncomplete`);
  return res.data;
};

// 여러 버킷리스트 일괄 완료 처리
export const completeMultipleBuckets = async (ids) => {
  const promises = ids.map(id => completeBucket(id));
  return await Promise.all(promises);
};

// 여러 버킷리스트 일괄 미완료 처리
export const uncompleteMultipleBuckets = async (ids) => {
  const promises = ids.map(id => uncompleteBucket(id));
  return await Promise.all(promises);
}; 