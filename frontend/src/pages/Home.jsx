import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 50%, #95d5b2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="container p-5 bg-white shadow-lg rounded" style={{ maxWidth: 500 }}>
        <div className="text-center mb-4">
          <svg width="60" height="60" fill="#38b000" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0Zm0 15A7 7 0 1 1 15 8 7 7 0 0 1 8 15Z"/>
            <path d="M11.354 5.646a.5.5 0 0 0-.708 0L7.5 8.793 5.854 7.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0-.708-.708Z"/>
          </svg>
          <h1 className="mt-3 mb-2" style={{ color: '#38b000', fontWeight: 700 }}>BucketList</h1>
          <p className="lead" style={{ color: '#40916c' }}>
            당신의 꿈과 목표를 기록하고, <br/> 성취를 함께하는 버킷리스트 플랫폼
          </p>
        </div>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success px-4" onClick={() => navigate('/login')}>로그인</button>
          <button className="btn btn-outline-success px-4" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default Home;