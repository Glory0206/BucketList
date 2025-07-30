import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getAllBuckets, 
  createBucket, 
  deleteBucket, 
  updateBucket 
} from "../services/bucketService";
import { getCategories } from "../services/categoryService";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditModeToggle from "../components/EditModeToggle";
import EditSaveCancelButtons from "../components/EditSaveCancelButtons";
import EditActionButtons from "../components/EditActionButtons";
import ItemDetailModal from "../components/ItemDetailModal";
import CategoryCreateModal from "../components/CategoryCreateModal";
import CategoryListModal from "../components/CategoryListModal";

function BucketListAll() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editSelectedCategory, setEditSelectedCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const dateInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          getAllBuckets(),
          getCategories()
        ]);
        setItems(itemsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        setItems([]);
        setCategories([]);
        const msg = error.response?.data?.message || '데이터를 불러오지 못했습니다.';
        alert(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    try {
      const response = await createBucket({ 
        content: newItem, 
        categoryId: selectedCategory || null,
        dueDate 
      });
      if (response) {
        setItems([...items, response]);
        setNewItem('');
        setSelectedCategory('');
        setDueDate(null);
      } else {
        alert('버킷 아이템 등록에 실패했습니다.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || '버킷 아이템 등록 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  // 카테고리 생성 핸들러
  const handleCategoryCreate = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  // 삭제 기능
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteBucket(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      const msg = error.response?.data?.message || '삭제 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  // 수정 모드 진입
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditContent(item.content);
    setEditSelectedCategory(item.category?.id?.toString() || '');
    setEditDueDate(item.dueDate ? new Date(item.dueDate) : null);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditId(null);
    setEditContent('');
    setEditSelectedCategory('');
    setEditDueDate(null);
  };

  // 수정 저장
  const handleSaveEdit = async (id) => {
    if (!editContent.trim()) return;
    try {
      await updateBucket({ 
        id, 
        content: editContent, 
        categoryId: editSelectedCategory || null,
        dueDate: editDueDate 
      });
      setItems(items.map(item =>
        item.id === id
          ? { 
              ...item, 
              content: editContent, 
              category: categories.find(cat => cat.id.toString() === editSelectedCategory),
              dueDate: editDueDate ? editDueDate.toISOString().split('T')[0] : null 
            }
          : item
      ));
      handleCancelEdit();
    } catch (error) {
      const msg = error.response?.data?.message || '수정 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  // 모달 열기
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // 모달에서 사용할 최신 아이템 갱신 함수
  const refreshAndSelect = async (id) => {
    const res = await getAllBuckets();
    setItems(res);
    const updated = res.find(i => i.id === id);
    setSelectedItem(updated);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="container p-4 bg-white shadow-lg rounded" style={{ maxWidth: '600px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-success mb-0">BucketList (전체)</h2>
            <div>
              <button className="btn btn-outline-info btn-sm me-2" onClick={() => setCategoryModalOpen(true)}>
                카테고리 관리
              </button>
              <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/bucketlist/split')}>
                미완료/완료 분리 보기
              </button>
            </div>
          </div>
          <div className="mb-3 text-end">
            <EditModeToggle editMode={editMode} setEditMode={setEditMode} />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="새로운 버킷아이템을 입력하세요"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddItem(); }}
              style={{ zIndex: 1 }}
            />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ maxWidth: '150px' }}
            >
              <option value="">카테고리 선택</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ReactDatePicker
              selected={dueDate}
              onChange={date => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜 선택"
              className="form-control"
              popperPlacement="top"
              minDate={new Date()}
              customInput={
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  tabIndex={-1}
                  style={{ background: 'white', borderLeft: 'none', borderColor: '#e0e0e0' }}
                >
                  <span role="img" aria-label="달력">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#198754" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-1h12a1 1 0 0 1 1 1v1H1V4a1 1 0 0 1 1-1z"/>
                    </svg>
                  </span>
                </button>
              }
            />
            <button className="btn btn-success" onClick={handleAddItem}>추가</button>
          </div>
          <div className="mb-2 text-end" style={{ fontSize: '0.9em', color: '#198754' }}>
            {dueDate
              ? `희망 날짜: ${dueDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}`
              : '완료 희망일을 선택하세요(미선택 가능)'}
          </div>
          {loading ? (
            <p className="text-center">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted">등록된 버킷 아이템이 없습니다.</p>
          ) : (
            <ul className="list-group">
              {items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {editId === item.id ? (
                    <div className="w-100 d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        style={{ maxWidth: 200 }}
                      />
                      <select
                        className="form-select me-2"
                        value={editSelectedCategory}
                        onChange={e => setEditSelectedCategory(e.target.value)}
                        style={{ maxWidth: 120 }}
                      >
                        <option value="">카테고리 선택</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <ReactDatePicker
                        selected={editDueDate}
                        onChange={date => setEditDueDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control me-2"
                        minDate={new Date()}
                        placeholderText="날짜 선택"
                        style={{ maxWidth: 150 }}
                      />
                      <EditSaveCancelButtons
                        onSave={() => handleSaveEdit(item.id)}
                        onCancel={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <>
                      <span 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleOpenModal(item)}
                        title="클릭하여 상세보기"
                      >
                        {item.content}
                        {item.category && (
                          <span 
                            className="badge me-2" 
                            style={{ 
                              backgroundColor: item.category.color, 
                              color: '#fff',
                              fontSize: '0.8em'
                            }}
                          >
                            {item.category.name}
                          </span>
                        )}
                        {item.dueDate && (
                          <span style={{ color: '#198754', fontSize: '0.9em', marginLeft: 8 }}>
                            ({new Date(item.dueDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })})
                          </span>
                        )}
                      </span>
                      {editMode && (
                          <div>
                            <EditActionButtons
                              onEdit={() => handleEdit(item)}
                              onDelete={() => handleDelete(item.id, true)}
                            />
                          </div>
                        )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* 모달 컴포넌트 */}
      <ItemDetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        refreshItem={() => refreshAndSelect(selectedItem.id)}
      />
      
      <CategoryListModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreate={handleCategoryCreate}
      />
    </div>
  );
}
export default BucketListAll;
