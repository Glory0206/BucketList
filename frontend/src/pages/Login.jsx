import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {login} from '../services/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await login(email, password);
      navigate('/bucketlist/all');
    } catch(err){
      const msg = err.response?.data?.message || '서버 오류';
      alert('로그인 실패: ' + msg);
    }
  };

  return(
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <form onSubmit={handleSubmit} className='container mt-5 p-4 bg-white shadow-lg rounded' style={{maxWidth: '400px'}}>
          <h2 className='text-center mb-4'>Login</h2>
          <div className='mb-3 text-center'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="form-control"
            />
          </div>
          <div className='mb-3 text-center'>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="form-control"
            />
          </div>
          <button type="submit" className='btn btn-success w-100'>Login</button>
          <p className='text-center mt-3'>회원가입을 원하신다면, {' '}
            <span
              style={{ color: '#198754', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => navigate('/signup')}>
              여기
            </span>
              를 눌러주세요.
            </p>
        </form>
      </div>
    </div>
  )
}
export default Login;