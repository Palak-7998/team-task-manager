import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // Get role and handle capitalization (Admin vs admin)
  const rawRole = localStorage.getItem('role') || 'member';
  const role = rawRole.toLowerCase(); 

  const API_BASE_URL = 'https://team-task-manager-ftsw.onrender.com/api/tasks';

  // 1. Fetch tasks from backend
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

  // 2. Add task function
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post(API_BASE_URL, { title });
      // Clear input and refresh list
      setTitle('');
      getTasks();
    } catch (err) {
      console.error("Add error", err);
    }
  };

  // 3. COMPLETE DELETE FUNCTION
  const deleteTask = async (taskId) => {
    if (!taskId) return;

    // OPTIMISTIC UPDATE: Remove from UI immediately so the user sees it vanish
    const updatedTasks = tasks.filter(task => (task._id !== taskId && task.id !== taskId));
    setTasks(updatedTasks);

    try {
      // Tell backend to delete
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      console.log("Deleted successfully from server");
    } catch (err) {
      console.error("Server delete failed, but task removed from UI for now", err);
      // Optional: Refresh from server if you want to show it failed
      // getTasks(); 
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '200px', margin: '0 auto 30px', background: '#fff' }}>
        <h3>Total Tasks</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>{tasks.length}</p>
      </div>

      <form onSubmit={handleAddTask} style={{ marginBottom: '30px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="What needs to be done?" 
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px 25px', marginLeft: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Task
        </button>
      </form>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {tasks.map((task) => (
          <div key={task._id || task.id} style={{ background: '#f8f9fa', border: '1px solid #e9ecef', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>{task.title}</span>
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
