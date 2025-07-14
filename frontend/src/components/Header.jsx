import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Header(){
    return(
        <nav className=''>
            <div className='d-flex px-4 py-3 border-bottom border-success'>
                <Link to="/" className="navbar-brand fw-bold text-success">BucketList</Link>
                <div className='ms-auto'>
                    <Link to="/login" className="text-decoration-none text-success me-2" style={{ cursor: 'pointer' }}>
                        로그인
                    </Link>
                    |
                    <Link to="/signup" className="text-decoration-none text-success ms-2" style={{ cursor: 'pointer' }}>
                        회원가입
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Header;