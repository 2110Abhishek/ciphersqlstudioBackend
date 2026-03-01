const pool = require('../config/pg');
const { saveAttempt } = require('./attemptController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.executeQuery = async (req, res) => {
    const { query, assignmentId } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    // Optional: Get user if token is present
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            userId = decoded.id;
        } catch (err) {
            console.warn('Invalid token in query request');
        }
    }

    const upperQuery = query.toUpperCase();
    const forbiddenKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];

    for (let keyword of forbiddenKeywords) {
        if (upperQuery.includes(keyword)) {
            return res.status(403).json({ message: `Query contains forbidden keyword: ${keyword}. Only SELECT is allowed.` });
        }
    }

    try {
        const start = Date.now();
        const result = await pool.query(query);
        const duration = Date.now() - start;

        const queryResult = {
            success: true,
            data: result.rows,
            fields: result.fields.map(f => f.name),
            rowCount: result.rowCount,
            duration: `${duration}ms`
        };

        // Log attempt if user and assignment are present
        if (userId && assignmentId) {
            await saveAttempt({
                user: userId,
                assignment: assignmentId,
                query,
                status: 'Success',
                rowCount: result.rowCount
            });
        }

        res.json(queryResult);
    } catch (err) {
        // Log failed attempt if user and assignment are present
        if (userId && assignmentId) {
            await saveAttempt({
                user: userId,
                assignment: assignmentId,
                query,
                status: 'Error',
                errorMessage: err.message
            });
        }

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
