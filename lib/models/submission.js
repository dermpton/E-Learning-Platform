const express = require('express');
const mongoose = require('mongoose');
const connectedDatabase = require('../db'); 

module.exports = mongoose.model('submission', new mongoose.Schema({
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'student'},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher'},
    assignment: {type: mongoose.Schema.Types.ObjectId, ref: 'assignment'},
    submissionDate: {type: Date, default: Date.now },
    submittedFile: String, // url to file path
    grade: Number, 
    feedback: String,
}));

