const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const connectedDatabase = require('../lib/db');

app.use(express.json());
app.use(express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname + '/views'));





router.get('/students', async(req,res)=>{
  const data = {
    teachersName: "John Doe",
    systemRole: "Lecturer",
    studentTotal: 130,
    courseName: "Software Project Management",
    getStudents: 130,
    adminSchool: "National University of Science & Technology",
    studentName: "Bob Ann",
    layout: null,
  };
  
  res.render('students',data,(err, html) => {
    if (err) {
      res.status(500).send(`Uh oh: ${err.message}`);
    } else {
      res.json(html);
      
    }
})});

router.get('/teacher', async(req, res)=> {
  const data = {
    teachersName: "John Doe",
    email: "johndoe@gmail.com",
    systemRole: "Lecturer",
    studentTotal: 130,
    courseName: "Software Project Management",
    getStudents: 130,
    adminSchool: "National University of Science & Technology",
    getCourseIndex: 5,
    initialDate: new Date(),
    lastLogout: "N/A",
    layout: null,
  };

  res.render('teacher', data, (err, html) => {
    if (err){
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
})});

router.get('/calendar', async(req, res)=>{
  res.render('calendar', {layout: null}, (err, html)=>{
    if (err){
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });
});

router.get('/settings', async(req, res)=>{
  const data = {
    layout: null,
  };

  res.render('settings', data, (err, html)=>{
    if(err) {
      res.status(500).send(`Error: ${err.message}`)
    } else {
      res.json(html);
    }
  });
});

router.get('/logout', (req,res)=>{
  const data = {
    layout: null,
  };

  res.render('logout', data, (err, html)=>{
    if (err) {
      res.status(500).send(`Error: ${err.message}`)
    } else {
      res.json(html);
    }
  });
});


router.get('/add', async(req, res) => {
  const data = {
    layout: null,
  };

  res.render('add', data, (err, html)=>{
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });

});

module.exports = router;