const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const seedData = require('./seed');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/query', require('./routes/queryRoutes'));
app.use('/api/hint', require('./routes/hintRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));

// Remote Seeding Route (Visit this ONCE after deployment: /api/admin/seed)
app.get('/api/admin/seed', async (req, res) => {
    try {
        console.log('Starting remote seeding process...');
        const result = await seedData();
        res.json(result);
    } catch (err) {
        console.error('Remote Seed Error:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Unknown error during seeding',
            details: err.stack
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
