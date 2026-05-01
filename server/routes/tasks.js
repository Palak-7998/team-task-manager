const router = require('express').Router();
const Task = require('../models/Task');

// 1. Create a Task
router.post('/create', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            status: 'To Do'
        });
        const savedTask = await newTask.save();
        res.status(200).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// 2. Get All Tasks (To show on the Dashboard)
router.get('/all', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;