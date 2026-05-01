import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // 1. Get role and fix capitalization
  const role = (localStorage.getItem('role') || 'member').toLowerCase(); 

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
      getTasks(); // Refresh list from server
    } catch (err) {
      console.error("Add error", err);
    }
  };

  // 2. The Permanent Delete Function
  const deleteTask = async (task) => {
    // Check for every possible ID format MongoDB uses
    const id = task._id || task.id || (task.data && task.data._id);
    
    if (!id) {
      console.error("No ID found for task:", task);
      return;
    }

    try {
      // This sends the request to: https://.../api/tasks/YOUR_ID
      await axios.delete(`${API_BASE_URL}/${id}`);
      
      // Update the UI immediately so the user sees it vanish
      setTasks(prevTasks => prevTasks.filter(t => (t._id !== id && t.id !== id)));
    } catch (err) {
      console.error("Delete failed on server", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '200px', margin: '0 auto 30px' }}>
        <h3>Total Tasks</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{tasks.length}</p>
      </div>

      <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="New task..." 
          style={{ padding: '10px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: '0' }}>
        {tasks.map((task, index) => (
          <li key={task._id || index} style={{ background: '#f9f9f9', border: '1px solid #ddd', margin: '10px auto', padding: '15px', width: '450px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{task.title}</span>
            {role === 'admin' && (
              <button 
                onClick={() => deleteTask(task)} 
                style={{color: 'white', background: '#d9534f', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer'}}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
