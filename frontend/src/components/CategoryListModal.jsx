import React, { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "../services/categoryService";
import CategoryCreateModal from "./CategoryCreateModal";

export default function CategoryListModal({ open, onClose, onCategoryUpdate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error('카테고리 목록을 불러오는데 실패했습니다:', error);
      alert('카테고리 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCreate = (newCategory) => {
    setCategories([...categories, newCategory]);
    onCategoryUpdate && onCategoryUpdate();
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      onCategoryUpdate && onCategoryUpdate();
      alert('카테고리가 삭제되었습니다.');
    } catch (error) {
      alert('카테고리 삭제에 실패했습니다.');
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">카테고리 관리</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">등록된 카테고리 목록</h6>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => setShowCreateModal(true)}
                >
                  새 카테고리 생성
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <p>등록된 카테고리가 없습니다.</p>
                </div>
              ) : (
                <div className="row">
                  {categories.map((category) => (
                    <div key={category.id} className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-3" 
                              style={{ 
                                width: "24px", 
                                height: "24px", 
                                backgroundColor: category.color 
                              }}
                            ></div>
                            <div>
                              <h6 className="mb-0">{category.name}</h6>
                              <small className="text-muted">색상: {category.color}</small>
                            </div>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="카테고리 삭제"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 생성 모달 */}
      <CategoryCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCategoryCreate}
      />
    </>
  );
} 