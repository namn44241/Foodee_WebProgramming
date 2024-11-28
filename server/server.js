require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT 1');
        res.json({ message: 'Database connection successful', data: rows });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({ 
            message: 'Database connection failed',
            error: error.message,
            code: error.code
        });
    }
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Something broke!', 
        error: err.message,
        code: err.code 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 