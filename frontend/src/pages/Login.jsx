import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { login, requestResetPasswordCode, resetPassword } from '../services/auth';

function Login() {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/bucketlist/all');
    } catch (err) {
      const msg = err.response?.data?.message || '서버 오류';
      alert('로그인 실패: ' + msg);
    }
  };

  const handleResetPasswordRequest = async () => {
    if (!resetEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const msg = await requestResetPasswordCode(resetEmail);
      alert(msg); // "코드가 이메일로 전송되었습니다."
      setCodeSent(true); // 인증코드 입력 UI 보이기
    } catch (err) {
      const msg = err.response?.data?.message || '서버 오류';
      alert('재설정 실패: ' + msg);
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!code || !newPassword) {
      alert('인증코드와 새 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const msg = await resetPassword({
        email: resetEmail,
        code,
        newPassword
      });
      alert(msg); // "비밀번호가 변경되었습니다."
      setShowModal(false);
      setCodeSent(false);
      setCode('');
      setNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.message || '서버 오류';
      alert('변경 실패: ' + msg);
    }
  };

  return (
    <div style={{ backgroundColor: '#d8f3dc', height: '100vh' }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <form onSubmit={handleSubmit} className='container mt-5 p-4 bg-white shadow-lg rounded' style={{ maxWidth: '400px' }}>
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

          <p className='text-center mt-3'>
            회원가입을 원하신다면, {' '}
            <span
              style={{ color: '#198754', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => navigate('/signup')}
            >
              여기
            </span>
            를 눌러주세요.
          </p>
                    <p className='text-center mt-3'>
            비밀번호를 잊으셨다면, {' '}
            <span
              style={{ color: '#198754', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setShowModal(true)}
            >
              여기
            </span>
            를 눌러주세요.
          </p>
        </form>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">비밀번호 재설정</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowModal(false);
                  setCodeSent(false);
                  setCode('');
                  setNewPassword('');
                }} />
              </div>
              <div className="modal-body">
                <p>가입한 이메일을 입력해주세요:</p>
                <input
                  type="email"
                  className="form-control mb-2"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  disabled={codeSent} // 인증코드 발송 이후 이메일은 수정 못 하게
                />

                {codeSent && (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="인증코드 입력"
                    />
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호"
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowModal(false);
                  setCodeSent(false);
                  setCode('');
                  setNewPassword('');
                }}>닫기</button>

                {!codeSent ? (
                  <button type="button" className="btn btn-success" onClick={handleResetPasswordRequest}>
                    인증 코드 발송
                  </button>
                ) : (
                  <button type="button" className="btn btn-success" onClick={handleResetPasswordSubmit}>
                    비밀번호 재설정
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
