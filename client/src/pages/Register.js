import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // We use the FULL address here so it cannot fail
      await axios.post('https://team-task-manager-ftsw.onrender.com/api/auth/register', { name, email, password, role });
      alert("Registration Successful!");
    } catch (err) {
      alert("Failed! Make sure the black terminal says DATABASE CONNECTED");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Create Account</h1>
      <form onSubmit={handleRegister}>
        <input placeholder="Name" onChange={e => setName(e.target.value)} required /><br/><br/>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required /><br/><br/>
        <select onChange={e => setRole(e.target.value)}>
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select><br/><br/>
        <button type="submit">Register Now</button>
      </form>
    </div>
  );
}
export default Register;
