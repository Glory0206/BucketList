import api from './api';

// 파일 업로드
export const uploadFile = async (bucketItemId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await api.post(`/bucket/bucket-item/${bucketItemId}/file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 파일 삭제
export const deleteFile = async (bucketItemId, fileId) => {
  const res = await api.delete(`/bucket/bucket-item/${bucketItemId}/file/${fileId}`);
  return res.data;
}; 