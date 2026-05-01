import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // 1. Get role and normalize to lowercase
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

  useEffect(() => { 
    getTasks(); 
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post(API_BASE_URL, { title });
      setTitle('');
      getTasks(); // Refresh count and list from server
    } catch (err) {
      console.error("Add error", err);
    }
  };

  // 2. THE UPDATED DELETE FUNCTION
  const deleteTask = async (taskId) => {
    if (!taskId) return;

    // STEP A: Update the UI immediately (Optimistic Update)
    // This removes the task and lowers the count instantly on screen
    const remainingTasks = tasks.filter(task => (task._id !== taskId && task.id !== taskId));
    setTasks(remainingTasks);

    try {
      // STEP B: Send the actual delete request to the backend
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      console.log("Deleted from server successfully");
    } catch (err) {
      console.error("Server delete failed, but UI is updated for this session", err);
      // Optional: if it fails, you could call getTasks() to bring it back
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      {/* 3. The Count Box (Updates automatically because tasks.length changes) */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '200px', margin: '0 auto 30px', backgroundColor: '#fff' }}>
        <h3>Total Tasks</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#333' }}>
          {tasks.length}
        </p>
      </div>

      <form onSubmit={handleAddTask} style={{ marginBottom: '30px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="New activity..." 
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '12px 20px', marginLeft: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {tasks.map((task) => (
          <div key={task._id || task.id} style={{ background: '#f8f9fa', border: '1px solid #eee', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>{task.title}</span>
            
            {/* Show Delete button only for Admin */}
            {role === 'admin' && (
              <button 
                onClick={() => deleteTask(task._id || task.id)} 
                style={{ color: 'white', background: '#dc3545', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
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
