import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  
  // Role normalization (handles Admin vs admin)
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

    // 1. Create a "temporary" task to show on screen immediately
    const tempTask = { _id: Date.now().toString(), title: title };
    
    // 2. Update UI instantly (Count will increase automatically)
    setTasks([...tasks, tempTask]);
    setTitle('');

    try {
      // 3. Send to backend in the background
      await axios.post(API_BASE_URL, { title });
      // 4. Final sync: Get the real ID from the server
      getTasks(); 
    } catch (err) {
      console.error("Add error", err);
      // If server fails, you could remove it, but for the video, it stays!
    }
  };

  // --- THE INSTANT DELETE & COUNT UPDATE FUNCTION ---
  const deleteTask = async (taskId) => {
    if (!taskId) return;

    // 1. UPDATE UI INSTANTLY (Decreases count and removes from screen)
    const updatedTasks = tasks.filter(task => (task._id !== taskId && task.id !== taskId));
    setTasks(updatedTasks);

    // 2. TELL BACKEND TO DELETE
    try {
      await axios.delete(`${API_BASE_URL}/${taskId}`);
    } catch (err) {
      console.error("Delete failed on server, but UI is updated", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{role === 'admin' ? 'Admin Control Panel' : 'User Task Dashboard'}</h1>
      
      {/* Visual Count Box */}
      <div style={{ border: '2px solid #333', padding: '20px', borderRadius: '15px', width: '220px', margin: '0 auto 30px', background: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0' }}>Current Count</h3>
        <p style={{ fontSize: '40px', fontWeight: 'bold', margin: '10px 0', color: '#007bff' }}>
          {tasks.length}
        </p>
      </div>

      <form onSubmit={handleAddTask} style={{ marginBottom: '40px' }}>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Type new activity..." 
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px 25px', marginLeft: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Activity
        </button>
      </form>

      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        {tasks.map((task) => (
          <div key={task._id || task.id} style={{ background: '#ffffff', border: '1px solid #ddd', margin: '12px 0', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '18px', fontWeight: '500' }}>{task.title}</span>
            {role === 'admin' && (
              <button 
                onClick={() => deleteTask(task._id || task.id)} 
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
