import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BucketList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchItems = async () => {
      try{
        let response;
        if (filter === 'all'){
          response = await api.get('/bucket');
        } else if (filter === 'completed'){
          response = await api.get('/bucket/completed');
        } else if (filter === 'incompleted'){
          response = await api.get('/bucket/incompleted');
        }
        setItems(response.data);
      } catch (error){
        console.error('아이템 불러오기 실패: ', error);
        alert('버킷리스트를 불러오지 못했습니다.');
      } finally{
        setLoading(false);
      }
    };

    fetchItems();
  }, [filter]);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    try {
      const response = await api.post('/bucket', { content: newItem, dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null });
      if (response.data) {
        setItems([...items, response.data]);
        setNewItem('');
        setDueDate(null);
      } else {
        alert('버킷 아이템 등록에 실패했습니다.');
      }
    } catch (error) {
      alert('버킷 아이템 등록 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <div className="container p-4 bg-white shadow-lg rounded" style={{ maxWidth: '600px' }}>
          <h2 className="text-success text-center mb-4">BucketList</h2>

          <div className="mb-3 text-center">
            <button
              className={`btn btn-sm me-2 ${filter === 'all' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('all')}
            >전체</button>
            <button
              className={`btn btn-sm me-2 ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('completed')}
            >완료</button>
            <button
              className={`btn btn-sm ${filter === 'incompleted' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('incompleted')}
            >미완료</button>
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
            <ReactDatePicker
                selected={dueDate}
                onChange={date => setDueDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜 선택"
                className="form-control"
                popperPlacement="top" // 달력이 input 위에 뜨도록
                minDate={new Date()} // 오늘 이전 날짜는 선택 불가
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
              : '완료 희망일을 선택하세요'}
          </div>

          {loading ? (
            <p className="text-center">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted">등록된 버킷 아이템이 없습니다.</p>
          ) : (
            <ul className="list-group">
              {items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.content}
                  {/* 추후 버튼 추가 자리 */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
export default BucketList;
