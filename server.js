const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'modal',
    database: 'task_manager'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Routes
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    db.query('INSERT INTO tasks SET ?', task, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: result.insertId });
    });
});

app.put('/tasks/:id', (req, res) => {
    const task = req.body;
    const { id } = req.params;
    db.query('UPDATE tasks SET ? WHERE id = ?', [task, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.sendStatus(200);
    });
});

app.delete('/tasks/:id', (req, res) => {
        const { id } = req.params;
        db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.sendStatus(200);
        });
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
