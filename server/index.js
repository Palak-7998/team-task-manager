const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// --- SCHEMAS ---
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Member' }
}));

const Task = mongoose.model('Task', new mongoose.Schema({
  title: String,
  status: { type: String, default: 'Pending' }
}));

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ error: "User already exists" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.status(200).json({ message: "Login Success", user });
  else res.status(401).json({ message: "Invalid Credentials" });
});

// --- TASK ROUTES (Fixes the 404 error) ---
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

// --- CONNECTION ---
// Update this line in server/index.js
const mongoURI = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/final_project_db";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ DATABASE CONNECTED"))
  .catch(err => console.log("❌ DB ERROR", err));
// Use process.env.PORT for Railway, or 5000 for local testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));