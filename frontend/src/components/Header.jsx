import 'bootstrap/dist/css/bootstrap.min.css';
import { logout } from '../services/auth';
import { Link, useNavigate } from 'react-router-dom';

function Header(){
    const nickname = localStorage.getItem('nickname');
    const isLoggedIn = !!nickname;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate)
    };

    return(
        <nav className=''>
            <div className='d-flex px-4 py-3 border-bottom border-success'>
                <Link to="/" className="navbar-brand fw-bold text-success">BucketList</Link>
                <div className='ms-auto d-flex align-items-center'>
                    {isLoggedIn ? (
                        <>
                            <span className="me-3 fw-bold text-success">{nickname ? `${nickname}님` : '사용자'}</span>
                            <button className="text-success me-2" style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }} onClick={handleLogout}>
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