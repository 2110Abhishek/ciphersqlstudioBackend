const Assignment = require('../models/Assignment');

exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().select('-expectedResult -sampleDataSchema');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAssignmentBySlug = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({ slug: req.params.slug }).select('-expectedResult');
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
