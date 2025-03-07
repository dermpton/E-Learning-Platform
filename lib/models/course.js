const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectedDatabase = require('../db'); // immediate execution

const courseSchema = new mongoose.Schema({
    activeLearnerTotal: Number, 
    courseName: String, 
    addCourse: [String],
    courseCode: {type: String, unique: true},
    getCourseIndex: Number, 
    instructor: { type: mongoose.Schema.ObjectId, ref: 'teacher'},
    students: [{type: mongoose.Schema.ObjectId, ref: 'student'}],
});

module.exports = mongoose.model('course', courseSchema);