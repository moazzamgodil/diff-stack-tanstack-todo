const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new Database('todos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const getTodos = db.prepare(`
  SELECT
    id,
    title,
    completed,
    created_at
  FROM todos
  ORDER BY id DESC
`);

const getTodo = db.prepare(`
  SELECT
    id,
    title,
    completed,
    created_at
  FROM todos
  WHERE id = ?
`);

const createTodo = db.prepare(`
  INSERT INTO todos (title)
  VALUES (?)
`);

const updateTodo = db.prepare(`
  UPDATE todos
  SET title = ?, completed = ?
  WHERE id = ?
`);

const deleteTodo = db.prepare(`
  DELETE FROM todos
  WHERE id = ?
`);

// GET /api/todos
app.get('/api/todos', (req, res) => {
    const todos = getTodos.all().map(todo => ({
        ...todo,
        completed: Boolean(todo.completed)
    }));

    res.json(todos);
});

// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
    const todo = getTodo.get(req.params.id);

    if (!todo) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    res.json({
        ...todo,
        completed: Boolean(todo.completed)
    });
});

// POST /api/todos
app.post('/api/todos', (req, res) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: 'Title is required'
        });
    }

    const result = createTodo.run(title.trim());

    const todo = getTodo.get(result.lastInsertRowid);

    res.status(201).json({
        ...todo,
        completed: Boolean(todo.completed)
    });
});

// PATCH /api/todos/:id
app.patch('/api/todos/:id', (req, res) => {
    const existingTodo = getTodo.get(req.params.id);

    if (!existingTodo) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    const title =
        req.body.title !== undefined
            ? req.body.title.trim()
            : existingTodo.title;

    const completed =
        req.body.completed !== undefined
            ? Boolean(req.body.completed)
            : Boolean(existingTodo.completed);

    if (!title) {
        return res.status(400).json({
            message: 'Title is required'
        });
    }

    updateTodo.run(
        title,
        completed ? 1 : 0,
        req.params.id
    );

    const todo = getTodo.get(req.params.id);

    res.json({
        ...todo,
        completed: Boolean(todo.completed)
    });
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
    const result = deleteTodo.run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            message: 'Todo not found'
        });
    }

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});