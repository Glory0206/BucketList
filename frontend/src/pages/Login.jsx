import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:8080/api/auth/login', {email, password});

      const token = res.data.token;
      localStorage.setItem('token', token);

      navigate('/bucketlist');
    } catch(err){
      alert('로그인 실패: ' + err.response?.data?.message || '서버 오류');
    }
  };

  return(
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit">Login</button>
    </form>
  )
}
export default Login;