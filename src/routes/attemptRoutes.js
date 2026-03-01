const express = require('express');
const router = express.Router();
const { getUserAttempts } = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserAttempts);

module.exports = router;
