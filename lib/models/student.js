const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connectedDatabase = require('../db');

const studentSchema = new mongoose.Schema({
    // define the necessary
});

module.exports = mongoose.model('student', studentSchema);