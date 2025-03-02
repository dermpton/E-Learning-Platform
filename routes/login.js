const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();
const path = require('path');

const Student = require('../lib/models/student');
const Teacher = require('../lib/models/teacher');


app.use(express.json());
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(path.join(__dirname + '/public')));


router.post('/login', async(req, res)=>{
    const { email, password } = req.body;
    
    res.status(200).json({message: "Success"});
    // depending on what the user is, they could be a teacher or a student
    if (!systemRole) {
        res.redirect('/student');
    } else {
        res.redirect('/admin');
    }
    
});

module.exports = router;
