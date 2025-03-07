const express = require('express');
const mongoose = require('mongoose');
const connectedDatabase = require('../db'); 

module.exports = mongoose.model('assignment', new mongoose.Schema({
    title: String,
    courseName: { type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher'},
    description: String,
    attachment: String, // keep a file path or a URL 
    dueDate: Date, 
    dateIssued: Date, 
    courseCode: String, 
    getTime: Date, 
    gradeTotal: {type: String, default: '100 Points'},
}));