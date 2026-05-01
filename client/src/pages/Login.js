import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://team-task-manager-ftsw.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert("Login Successful!");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Invalid Credentials! Please register a NEW email first.");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required style={{ padding: '10px', marginBottom: '10px' }} /><br/>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', marginBottom: '20px' }} /><br/>
        <button type="submit" style={{ padding: '10px 40px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
      <p>Need an account? <a href="/register">Register here</a></p>
    </div>
  );
}

export default Login;
