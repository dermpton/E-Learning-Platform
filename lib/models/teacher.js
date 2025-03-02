const mongoose = require('mongoose');
const express = require('express');
const app = express();
const connectedDatabase = require('../db'); // immediate execution

const teacherSchema = new mongoose.Schema({
    // define the values you deem necessary
});


module.exports = mongoose.model('teacher', teacherSchema);
