import React, { useRef, useState } from 'react';
import { uploadFile, deleteFile } from '../services/fileService';

function ItemDetailModal({ isOpen, onClose, item, refreshItem }) {
  if (!isOpen || !item) return null;

  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // 파일 업로드
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadFile(item.id, file);
      if (refreshItem) refreshItem();
    } catch (err) {
      alert('파일 업로드 실패');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  // 파일 삭제
  const handleFileDelete = async (fileId) => {
    if (!window.confirm('정말 파일을 삭제하시겠습니까?')) return;
    setDeleting(true);
    try {
      await deleteFile(item.id, fileId);
      if (refreshItem) refreshItem();
    } catch (err) {
      alert('파일 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">버킷리스트 상세</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {item.category && (
              <div className="mb-3">
                <h6 className="text-success">카테고리</h6>
                <p className="mb-0">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: item.category.color,
                      color: '#fff',
                      fontSize: '0.9em',
                      padding: '0.4em 0.6em',
                      borderRadius: '0.4em'
                    }}
                  >
                    {item.category.name}
                  </span>
                </p>
              </div>
            )}
            <div className="mb-3">
              <h6 className="text-success">내용</h6>
              <p className="mb-0">{item.content}</p>
            </div>
            <div className="mb-3">
              <h6 className="text-success">완료 희망일</h6>
              <p className="mb-0">
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })
                  : '희망 일자 없음'
                }
              </p>
            </div>
            <div className="mb-3">
              <h6 className="text-success">상태</h6>
              <p className="mb-0">
                {item.completed ? (
                  <span className="badge bg-success">완료</span>
                ) : (
                  <span className="badge bg-warning text-dark">진행중</span>
                )}
              </p>
            </div>
            <div className="mb-3">
              <h6 className="text-success">생성일</h6>
              <p className="mb-0">
                {item.createdAt ? 
                  new Date(item.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 
                  '날짜 정보 없음'
                }
              </p>
            </div>
            {item.completedAt && (
              <div className="mb-3">
                <h6 className="text-success">완료일</h6>
                <p className="mb-0">
                  {new Date(item.completedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
            {item.completed && !item.completedAt && (
              <div className="mb-3">
                <h6 className="text-success">완료일</h6>
                <p className="mb-0 text-danger">완료된 항목이지만 완료일 정보가 없습니다</p>
              </div>
            )}
            {/* 파일 업로드/리스트 영역 */}
            <div className="mb-3">
              <h6 className="text-success">첨부파일</h6>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                disabled={uploading}
                className="form-control mb-2"
              />
              {uploading && <div className="text-info">업로드 중...</div>}
              <ul className="list-group">
                {item.files && item.files.length > 0 ? (
                  item.files.map((file) => (
                    <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <a href={`/uploads/${file.fileName}`} target="_blank" rel="noopener noreferrer">{file.fileName}</a>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleFileDelete(file.id)}
                        disabled={deleting}
                      >
                        {deleting ? '삭제 중...' : '삭제'}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">첨부파일 없음</li>
                )}
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailModal; 