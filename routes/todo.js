const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new todo
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const todo = new Todo({
            user: req.user._id,
            title,
            description
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all todos for the logged-in user with pagination and search
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        // Prepare query object to find todos
        const query = { user: req.user._id };
        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search using regex
        }

        // Find todos based on query, with pagination and pinned todos first
        const todos = await Todo.find(query)
            .sort({ pinned: -1 }) // Sort by pinned (true first)
            .sort({ createdAt: -1 }) // Secondary sort by createdAt (newest first)
            .limit(parseInt(limit)) // Limit number of todos per page
            .skip((parseInt(page) - 1) * parseInt(limit)); // Skip to the correct page

        const total = await Todo.countDocuments(query);

        res.json({
            todos,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific todo by id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a todo by id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, isFavorite, pinned } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
        if (pinned !== undefined) updateData.pinned = pinned;

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: updateData },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error('Error updating todo:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete a todo by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark a todo as favorite
router.put('/:id/favorite', authMiddleware, async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user._id;

        // Check if the todo exists and belongs to the logged-in user
        const todo = await Todo.findOne({ _id: todoId, user: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Toggle the favorite status
        todo.isFavorite = !todo.isFavorite;

        // Save the updated todo
        await todo.save();

        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark a todo as pinned
router.put('/:id/pinned', authMiddleware, async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.user._id;

        // Check if the todo exists and belongs to the logged-in user
        const todo = await Todo.findOne({ _id: todoId, user: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Toggle the pinned status
        todo.pinned = !todo.pinned;

        // Save the updated todo
        await todo.save();

        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
