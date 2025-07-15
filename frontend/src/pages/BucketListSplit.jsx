import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditModeToggle from "../components/EditModeToggle";
import EditSaveCancelButtons from "../components/EditSaveCancelButtons";
import EditActionButtons from "../components/EditActionButtons";

function BucketListSplit() {
  const [incompletedItems, setIncompletedItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editDueDate, setEditDueDate] = useState(null);
  const dateInputRef = useRef(null);
  const navigate = useNavigate();
    
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const [incompletedRes, completedRes] = await Promise.all([
          api.get('/bucket/incompleted'),
          api.get('/bucket/completed')
        ]);
        setIncompletedItems(incompletedRes.data);
        setCompletedItems(completedRes.data);
      } catch (error) {
        setIncompletedItems([]);
        setCompletedItems([]);
        alert('버킷리스트를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    try {
      const response = await api.post('/bucket', { content: newItem, dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null });
      if (response.data) {
        setIncompletedItems([...incompletedItems, response.data]);
        setNewItem('');
        setDueDate(null);
      } else {
        alert('버킷 아이템 등록에 실패했습니다.');
      }
    } catch (error) {
      alert('버킷 아이템 등록 중 오류가 발생했습니다.');
    }
  };

  // 삭제 기능
  const handleDelete = async (id, completed) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/bucket/${id}`);
      if (completed) {
        setCompletedItems(completedItems.filter(item => item.id !== id));
      } else {
        setIncompletedItems(incompletedItems.filter(item => item.id !== id));
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정 모드 진입
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditContent(item.content);
    setEditDueDate(item.dueDate ? new Date(item.dueDate) : null);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditId(null);
    setEditContent('');
    setEditDueDate(null);
  };

  // 수정 저장
  const handleSaveEdit = async (id, completed) => {
    if (!editContent.trim()) return;
    try {
      await api.put(`/bucket/${id}`, {
        content: editContent,
        dueDate: editDueDate ? editDueDate.toISOString().split('T')[0] : null
      });
      if (completed) {
        setCompletedItems(completedItems.map(item =>
          item.id === id
            ? { ...item, content: editContent, dueDate: editDueDate ? editDueDate.toISOString().split('T')[0] : null }
            : item
        ));
      } else {
        setIncompletedItems(incompletedItems.map(item =>
          item.id === id
            ? { ...item, content: editContent, dueDate: editDueDate ? editDueDate.toISOString().split('T')[0] : null }
            : item
        ));
      }
      handleCancelEdit();
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="container p-4 bg-white shadow-lg rounded" style={{ maxWidth: '1100px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-success mb-0">BucketList (미완료/완료 분리)</h2>
            <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/bucketlist/all')}>
              전체 리스트 보기
            </button>
          </div>
          <div className="mb-3 text-end">
            <EditModeToggle editMode={editMode} setEditMode={setEditMode} />
          </div>
          <div className="row">
            {/* 미완료 리스트 (왼쪽) */}
            <div className="col-md-6 border-end">
              <h4 className="text-success mb-3">미완료</h4>
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
              <ul className="list-group">
                {incompletedItems.map((item) => (
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
                          onSave={() => handleSaveEdit(item.id, false)}
                          onCancel={handleCancelEdit}
                        />
                      </div>
                    ) : (
                      <>
                        <span>
                          {item.content}
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
                              onDelete={() => handleDelete(item.id, false)}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* 완료 리스트 (오른쪽) */}
            <div className="col-md-6">
              <h4 className="text-secondary mb-3">완료</h4>
              <ul className="list-group">
                {completedItems.map((item) => (
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
                          onSave={() => handleSaveEdit(item.id, true)}
                          onCancel={handleCancelEdit}
                        />
                      </div>
                    ) : (
                      <>
                        <span>
                          {item.content}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BucketListSplit;
