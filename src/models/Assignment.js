const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
    },
    question: {
        type: String,
        required: true,
    },
    sampleDataSchema: {
        type: String,
        required: true,
    },
    expectedResult: {
        type: Array, // Array of objects
        required: false,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
