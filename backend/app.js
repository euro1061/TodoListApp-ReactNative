const express = require('express');
const mongoose = require('mongoose');
const app = express();

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/todoapp', { useNewUrlParser: true, useUnifiedTopology: true });

// สร้าง Schema
const TodoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', TodoSchema);

app.use(express.json());

// GET all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST new todo
app.post('/todos', async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: false
  });
  await newTodo.save();
  res.json(newTodo);
});

// PUT update todo
app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

// DELETE todo
app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.listen(3000, () => console.log('Server running on port 3000'));