const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    activeLearnerTotal: Number, 
    courseName: String, 
    addCourse: [String],
    courseCode: {type: String, unique: true},
    getCourseIndex: Number, 
    instructor: { type: mongoose.Schema.ObjectId, ref: 'Teacher'},
    students: [{type: mongoose.Schema.ObjectId, ref: 'Student'}],
});

module.exports = mongoose.model('Course', courseSchema);