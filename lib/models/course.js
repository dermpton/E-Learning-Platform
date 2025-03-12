const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    activeLearnerTotal: Number, 
    courseName: String, 
    description: String,
    createdAt: { type: Date, default: Date.now},
    addCourse: [String],
    courseCode: {
        type: String, 
        unique: true,
        default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
    },
    getCourseIndex: Number, 
    instructorId: { type: mongoose.Schema.ObjectId, ref: 'Teacher'},
    students: [{type: mongoose.Schema.ObjectId, ref: 'Student'}],
});

module.exports = mongoose.model('Course', courseSchema);