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
      // 1. Make sure "const res =" is here
      // 2. Make sure the link is exactly this
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
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <h2>Team Task Manager Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          placeholder="Email" 
          type="email"
          onChange={e => setEmail(e.target.value)} 
          style={{ padding: '10px', marginBottom: '10px', width: '250px' }} 
          required 
        /><br/>
        <input 
          placeholder="Password" 
          type="password"
          onChange={e => setPassword(e.target.value)} 
          style={{ padding: '10px', marginBottom: '20px', width: '250px' }} 
          required 
        /><br/>
        <button type="submit" style={{ padding: '10px 40px', background: 'blue', color: 'white', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p>Need an account? <a href="/register">Register here</a></p>
    </div>
  );
}

export default Login;
