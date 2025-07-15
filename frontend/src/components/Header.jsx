import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Header(){
    const nickname = localStorage.getItem('nickname');
    const isLoggedIn = !!nickname;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nickname');
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return(
        <nav className=''>
            <div className='d-flex px-4 py-3 border-bottom border-success'>
                <Link to="/" className="navbar-brand fw-bold text-success">BucketList</Link>
                <div className='ms-auto'>
                    {isLoggedIn ? (
                        <>
                            <span className="me-3 fw-bold text-success">{nickname ? `${nickname}님` : '사용자'}</span>
                            <button className="btn btn-outline-success btn-sm" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-decoration-none text-success me-2" style={{ cursor: 'pointer' }}>
                                로그인
                            </Link>
                            |
                            <Link to="/signup" className="text-decoration-none text-success ms-2" style={{ cursor: 'pointer' }}>
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Header;