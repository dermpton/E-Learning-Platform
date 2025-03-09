const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/login', async(req, res)=>{
  res.render('login', { layout: null });
});

router.get('signup', async(req, res)=>{
  res.render('login', { layout: null });
});

// From here-forth any personnel without their login details is prohibited
router.get('/admin/:email', async(req, res)=> {
  const data = {
    teachersName: "John Doe",
    systemRole: "Lecturer",
    studentTotal: 130,
    activeLearnerTotal: 72,
    courseName: "Software Project Management",
    addCourse: "Web Development",
    getStudents: 130,
    announcements: "Bob said: 'I forgot to submit the assignment' ",
    feedback: "Average: 78%",
    adminSchool: "National University of Science & Technology",
  };

  res.render('home', data);
});

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

router.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).render('error', {message: err.message });
});

router.use((req, res)=>{
res.status(404).render('error');
});

module.exports = router;