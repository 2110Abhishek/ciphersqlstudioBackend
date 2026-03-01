const Attempt = require('../models/Attempt');

exports.getUserAttempts = async (req, res) => {
    try {
        const attempts = await Attempt.find({
            user: req.user._id,
            assignment: req.query.assignmentId
        }).sort({ createdAt: -1 });
        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.saveAttempt = async (attemptData) => {
    try {
        const attempt = await Attempt.create(attemptData);
        return attempt;
    } catch (error) {
        console.error('Error saving attempt:', error);
    }
};
