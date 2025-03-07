const mongoose = require('mongoose');
const express = require('express');
const app = express();
const connectedDatabase = require('../db'); // immediate execution

const teacherSchema = new mongoose.Schema({
    teachersName: { type: String, required: true},
    systemRole: String,
    announcements: [String],
    feedback: [String],
    adminSchool: { type: String, default: 'Independent'},
    email: { type: String, unique: true, required: true},
    initialDate: { type: Date, default: Date.now },
    lastLogout: Date,
    password: { type: String, required: true },
});


module.exports = mongoose.model('teacher', teacherSchema);
