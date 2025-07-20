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
  const [selectedIncompleted, setSelectedIncompleted] = useState([]);
  const [selectedUncomplete, setSelectedUncomplete] = useState([]);
    
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
        const msg = error.response?.data?.message || '버킷리스트를 불러오지 못했습니다.';
        alert(msg);
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
      const msg = error.response?.data?.message || '버킷 아이템 등록 중 오류가 발생했습니다.';
      alert(msg);
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
      const msg = error.response?.data?.message || '삭제 중 오류가 발생했습니다.';
      alert(msg);
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
      const msg = error.response?.data?.message || '수정 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  // 미완료 체크박스 핸들러
  const handleCheckIncompleted = (id) => {
    setSelectedIncompleted(prev =>
      prev.includes(id) ? prev.filter(_id => _id !== id) : [...prev, id]
    );
  };
  // 완료 → 미완료 체크박스 핸들러
  const handleCheckUncomplete = (id) => {
    setSelectedUncomplete(prev =>
      prev.includes(id) ? prev.filter(_id => _id !== id) : [...prev, id]
    );
  };

  // 미완료 → 완료 일괄 처리
  const handleCompleteSelected = async () => {
    if (selectedIncompleted.length === 0) {
      alert('완료할 항목을 선택하세요.');
      return;
    }
    try {
      await Promise.all(selectedIncompleted.map(id => api.put(`/bucket/${id}/complete`)));
      const completed = incompletedItems.filter(item => selectedIncompleted.includes(item.id));
      setIncompletedItems(incompletedItems.filter(item => !selectedIncompleted.includes(item.id)));
      setCompletedItems([...completedItems, ...completed.map(item => ({ ...item, completed: true }))]);
      setSelectedIncompleted([]);
    } catch (error) {
      const msg = error.response?.data?.message || '완료 처리 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  // 완료 → 미완료 일괄 처리
  const handleUncompleteSelected = async () => {
    if (selectedUncomplete.length === 0) {
      alert('미완료로 변경할 항목을 선택하세요.');
      return;
    }
    try {
      await Promise.all(selectedUncomplete.map(id => api.put(`/bucket/${id}/uncomplete`)));
      const uncompleted = completedItems.filter(item => selectedUncomplete.includes(item.id));
      setCompletedItems(completedItems.filter(item => !selectedUncomplete.includes(item.id)));
      setIncompletedItems([...incompletedItems, ...uncompleted.map(item => ({ ...item, completed: false }))]);
      setSelectedUncomplete([]);
    } catch (error) {
      const msg = error.response?.data?.message || '미완료 처리 중 오류가 발생했습니다.';
      alert(msg);
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
              <h4 className="text-success mb-3 d-flex align-items-center justify-content-between">
                미완료
                {/* 선택 항목 완료 버튼 */}
                <button className="btn btn-outline-success btn-sm me-2" onClick={handleCompleteSelected} disabled={selectedIncompleted.length === 0}>
                  선택 항목 완료로 변경
                </button>
              </h4>
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
                    <div className="d-flex align-items-center w-100">
                      {/* 체크박스: 미완료 → 완료 */}
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedIncompleted.includes(item.id)}
                        onChange={() => handleCheckIncompleted(item.id)}
                        disabled={editId === item.id}
                        style={{ cursor: 'pointer' }}
                        aria-label="완료 처리"
                      />
                      {editId === item.id ? (
                        <>
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
                        </>
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
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* 완료 리스트 (오른쪽) */}
            <div className="col-md-6">
              <h4 className="text-secondary mb-3 d-flex align-items-center justify-content-between">
                완료
                <button className="btn btn-outline-danger btn-sm me-2" onClick={handleUncompleteSelected} disabled={selectedUncomplete.length === 0}>
                  선택 항목 미완료로 변경
                </button>
              </h4>
              <ul className="list-group">
                {completedItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center w-100">
                      {/* 체크박스: 완료 → 미완료 */}
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedUncomplete.includes(item.id)}
                        onChange={() => handleCheckUncomplete(item.id)}
                        disabled={editId === item.id}
                        style={{ cursor: 'pointer' }}
                        aria-label="미완료 처리"
                      />
                      {editId === item.id ? (
                        <>
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
                        </>
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
                    </div>
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