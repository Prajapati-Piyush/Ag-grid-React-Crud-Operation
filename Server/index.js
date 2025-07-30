import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

const app = express();

dotenv.config();

app.use(urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://emp-management-eight.vercel.app","http://localhost:5173"]
}));
app.use(express.json());

pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error connecting to DB:', err);
    } else {
        console.log('DB connected at:', result.rows[0].now);
    }
});

app.get('/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employees');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/employees', async (req, res) => {
    const { name, email, department } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO employees (name, email, department) VALUES ($1, $2, $3) RETURNING *',
            [name, email, department]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, department } = req.body;
    try {
        const result = await pool.query(
            'UPDATE employees SET name=$1, email=$2, department=$3 WHERE id=$4 RETURNING *',
            [name, email, department, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM employees WHERE id=$1', [id]);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.json({ success: true, message: 'API working' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
