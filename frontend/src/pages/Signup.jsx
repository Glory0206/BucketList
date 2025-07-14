import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,15}$/;
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,15}$/;

  const handleSignup = async (e) => {
    e.preventDefault();

    if(
        !passwordRegex.test(password) ||
        password !== confirmPassword ||
        !emailRegex.test(email)
      ){
        return;
      }

    try{
      await axios.post('http://localhost:8080/api/auth/signup', {email, password, nickname});

      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err){
      console.error('회원가입 error: ', err);
      alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
    }
  }

  return(
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <form onSubmit={handleSignup} className='container mt-5 p-4 bg-white shadow-lg rounded' style={{maxWidth: '400px'}}>
          <h2 className='text-center mb-4'>Signup</h2>
          <div className='mb-3 text-center'>
            <label className="form-label text-start w-100">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`form-control ${
                email && !emailRegex.test(email) ? 'is-invalid' : ''
              }`}
            />
            {email && !emailRegex.test(email) && (
              <div className="invalid-feedback">유효한 이메일 형식을 입력해주세요.</div>
            )}
          </div>
          <div className='mb-3 text-center'>
            <label className="form-label text-start w-100">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`form-control ${
                password && !passwordRegex.test(password) ? 'is-invalid' : ''
              }`}
            />
            {password && !passwordRegex.test(password) && (
              <div className="invalid-feedback">
                비밀번호는 8~15자이며 특수문자를 하나 이상 포함해야 합니다.
              </div>
            )}
          </div>
          <div className='mb-3 text-center'>
            <label className="form-label text-start w-100">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`form-control ${
                confirmPassword && confirmPassword !== password ? 'is-invalid' : ''
              }`}
            />
            {confirmPassword && confirmPassword !== password && (
              <div className="invalid-feedback">
                비밀번호가 일치하지 않습니다.
              </div>
            )}
          </div>
          <div className='mb-3 text-center'>
            <label className="form-label text-start w-100">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className={`form-control ${
                nickname && !nicknameRegex.test(nickname) ? 'is-invalid' : ''
              }`}
            />
            {nickname && !nicknameRegex.test(nickname) && (
              <div className="invalid-feedback">
                닉네임은 영어, 한글, 숫자만 사용 가능하며 공백이나 기호는 사용할 수 없습니다.
              </div>
            )}
          </div>
          <button type="submit" className='btn btn-success w-100'>SignUp</button>
        </form>
      </div>    
    </div> 
  )
}
export default Signup;
