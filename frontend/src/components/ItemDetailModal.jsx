import React from 'react';

function ItemDetailModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  // 디버깅 콘솔 출력
  console.log('Modal item data:', item);

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block' }} 
      tabIndex="-1"
    >
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
            
            {/* 완료된 항목이지만 완료일이 없는 경우 */}
            {item.completed && !item.completedAt && (
              <div className="mb-3">
                <h6 className="text-success">완료일</h6>
                <p className="mb-0 text-danger">완료된 항목이지만 완료일 정보가 없습니다</p>
              </div>
            )}
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