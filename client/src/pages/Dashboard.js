import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // Get role and handle capitalization (Admin vs admin)
  const rawRole = localStorage.getItem('role') || 'member';
  const role = rawRole.toLowerCase(); 

  const API_BASE_URL = 'https://team-task-manager-ftsw.onrender.com/api/tasks';

  // 1. Load tasks from Backend
  const getTasks = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => { 
    getTasks(); 
  }, []);

  // 2. Add a new task
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

  // 3. Delete a task (Admin only)
  const deleteTask = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      getTasks(); // Refresh list
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '200px', margin: '0 auto 30px' }}>
        <h3>{role === 'admin' ? 'System Tasks' : 'My Tasks'}</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.length}</p>
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
        {tasks.map((task) => (
          <li key={task._id} style={{ background: '#f4f4f4', margin: '10px auto', padding: '10px', width: '400px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{task.title}</span>
            {role === 'admin' && (
              <button 
                onClick={() => deleteTask(task._id)} 
                style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold'}}
              >
                [Delete]
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
