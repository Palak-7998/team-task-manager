import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  // UPDATED: Your live Render Backend URL
  const API_BASE_URL = 'https://team-task-manager-ftsw.onrender.com/api/tasks';

  // 1. Load tasks from Backend
  const getTasks = async () => {
    try {
      const res = await axios.get(API_BASE_URL); // Using Live Link
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => { getTasks(); }, []);

  // 2. Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post(API_BASE_URL, { title }); // Using Live Link
      setTitle('');
      getTasks(); // Refresh list
    } catch (err) {
      console.error("Add error", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>Project Dashboard</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.length}</p>
        </div>
      </div>

      <form onSubmit={handleAddTask}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter new task..." 
          style={{ padding: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: '20px' }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ background: '#f4f4f4', margin: '10px auto', padding: '10px', width: '400px', borderRadius: '5px' }}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
