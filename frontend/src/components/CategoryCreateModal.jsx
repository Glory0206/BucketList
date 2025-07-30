import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { createCategory } from "../services/categoryService";

export default function CategoryCreateModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#aabbcc");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const result = await createCategory({ name, color });
      onCreate && onCreate(result);
      setName("");
      setColor("#aabbcc");
      onClose && onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "카테고리 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">카테고리 생성</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label fw-bold">
                  카테고리 이름
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="카테고리 이름 입력"
                  maxLength={20}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">색상 선택</label>
                <div className="d-flex align-items-center gap-3">
                  <HexColorPicker color={color} onChange={setColor} />
                  <div 
                    className="rounded-circle border" 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      backgroundColor: color 
                    }} 
                    title={color}
                  ></div>
                  <span className="text-muted">{color}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                취소
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    생성 중...
                  </>
                ) : (
                  "생성"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 