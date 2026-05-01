import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
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
    if (!title.trim()) return;
    try {
      const res = await axios.post(API_BASE_URL, { title });
      // Add exactly 1 to the list
      setTasks(prev => [...prev, res.data]);
      setTitle('');
    } catch (err) {
      console.error("Add error", err);
    }
  };

  // --- FIXED DELETE: Uses Index as a backup ---
  const deleteTask = async (task, index) => {
    const id = task._id || task.id;

    // 1. Instantly remove from screen using the index
    // This GUARANTEES the count drops by 1 and the item vanishes
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    // 2. Try to delete from server if ID exists
    if (id) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
      } catch (err) {
        console.error("Server delete failed", err);
      }
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      <div style={{ border: '2px solid #333', padding: '20px', borderRadius: '15px', width: '220px', margin: '0 auto 30px', background: '#fff' }}>
        <h3 style={{ margin: '0' }}>Total Activities</h3>
        <p style={{ fontSize: '40px', fontWeight: 'bold', margin: '10px 0', color: '#007bff' }}>
          {tasks.length}
        </p>
      </div>

      <form onSubmit={handleAddTask} style={{ marginBottom: '40px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="New activity..." 
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px 25px', marginLeft: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Activity
        </button>
      </form>

      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        {tasks.map((task, index) => (
          <div key={index} style={{ background: '#ffffff', border: '1px solid #ddd', margin: '12px 0', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>{task.title}</span>
            {role === 'admin' && (
              <button 
                onClick={() => deleteTask(task, index)} 
                style={{ color: 'white', background: '#dc3545', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
