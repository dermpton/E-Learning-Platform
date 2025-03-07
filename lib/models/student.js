const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connectedDatabase = require('../db');

const studentSchema = new mongoose.Schema({
    studentCount: Number,
    announcements: [String],
    studentName: {type: String, required: true},
    email: { type: String, unique: true, required: true },
    adminSchool: { type: mongoose.Schema.Types.String, ref: 'teacher'},
    password: {type: String, required: true},
    feedback: [String],
    enrolledCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'course'}],
});

module.exports = mongoose.model('student', studentSchema);