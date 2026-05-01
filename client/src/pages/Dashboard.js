import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [role, setRole] = useState(localStorage.getItem('role') || 'member'); // Get role from storage

  const API_BASE_URL = 'https://team-task-manager-ftsw.onrender.com/api/tasks';

  const getTasks = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => { getTasks(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post(API_BASE_URL, { title });
      setTitle('');
      getTasks();
    } catch (err) {
      console.error("Add error", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      {/* 2. WHERE: The Title changes based on role */}
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <h3>{role === 'admin' ? 'System Wide Tasks' : 'My Total Tasks'}</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.length}</p>
        </div>
      </div>

      {/* Admin can see this, Member can see this - but you can hide the form for members if you want */}
      <form onSubmit={handleAddTask}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter new task..." 
          style={{ padding: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          {role === 'admin' ? 'Create System Task' : 'Add My Task'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: '20px' }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ background: '#f4f4f4', margin: '10px auto', padding: '10px', width: '400px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{task.title}</span>
            {/* 3. WHERE: Only Admin sees the Delete button */}
            {role === 'admin' && <button style={{color: 'red', border: 'none', cursor: 'pointer'}}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
