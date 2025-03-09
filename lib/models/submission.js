const mongoose = require('mongoose');

module.exports = mongoose.model('Submission', new mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    assignment: {type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
    submissionDate: {type: Date, default: Date.now },
    submittedFile: String, // url to file path
    grade: Number, 
    feedback: String,
}));

