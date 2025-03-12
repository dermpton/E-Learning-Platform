const mongoose = require('mongoose');

module.exports = mongoose.model('Submission', new mongoose.Schema({
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    assignmentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
    submissionDate: {type: Date, default: Date.now },
    filePath: String, // url to file path
    grade: Number, 
    feedback: String,
    originalFilename: {type: String, required: true },
}));

