import { useEffect, useState } from "react";
import api from "../services/api";

function BucketList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try{
        const response = await api.get('/bucket');
        setItems(response.data);
      } catch (error){
        console.error('아이템 불러오기 실패: ', error);
        alert('버킷리스트를 불러오지 못했습니다.');
      } finally{
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <div className="container p-4 bg-white shadow-lg rounded" style={{ maxWidth: '600px' }}>
          <h2 className="text-success text-center mb-4">나의 버킷리스트</h2>

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
