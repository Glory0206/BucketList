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
    <div>
      <h2>나의 버킷리스트</h2>
      {items.length === 0 ? (
        <p>등록된 버킷 아이템이 없습니다.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key = {item.id}>
              <span>
                {item.content}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
export default BucketList;
