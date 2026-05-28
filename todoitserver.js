
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User registered successfully' });
  });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send({ message: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.send({ message: 'Login successful', token });
  });
});

// Middleware to verify token
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
}

// Add Task
app.post('/tasks', authenticate, (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (user_id, title) VALUES (?, ?)', [req.userId, title], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Task added', id: result.insertId });
  });
});

// Get Tasks
app.get('/tasks', authenticate, (req, res) => {
  db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.userId], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
});

// Complete Task
app.put('/tasks/:id/complete', authenticate, (req, res) => {
  db.query('UPDATE tasks SET status="completed" WHERE id=? AND user_id=?', [req.params.id, req.userId], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Task marked as completed' });
  });
});

// Delete Task
app.delete('/tasks/:id', authenticate, (req, res) => {
  db.query('DELETE FROM tasks WHERE id=? AND user_id=?', [req.params.id, req.userId], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Task deleted' });
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
