const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectedDatabase = require('../db'); // immediate execution

const courseSchema = new mongoose.Schema({
    // define what you think is necessary
});

module.exports = mongoose.model('course', courseSchema);