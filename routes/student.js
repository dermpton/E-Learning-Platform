const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const connectedDatabase = require('../lib/db');
app.use(express.json());
app.use(express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname + '/views'));



const Student = require('../lib/models/student');
const Course = require('../lib/models/course');
const Teacher = require('../lib/models/course');


router.get('/home', async(req, res) => {
    
    const data = {
        courseName: "Software Project Management",
        teacherName: "Bob Ann",
        layout: null,
    };
    
      res.render('student/course-overview', data, (err, html)=>{
        if (err) {
          res.status(500).send(`Error: ${err.message}`);
        } else {
          res.json(html);
        }
      });

    // if (req.xhr || req.headers.accept.indexOf('json') > -1){
    //     res.render('student/course-overview', {layout: null}, (err, html)=>{
    //         if (err) {
    //             res.status(500).send(`Error: ${err.message}`)
    //         } else {
    //             res.json(html);
    //         }
    //     });
    // }
});

router.get('/calendar', async(req, res)=>{
    const data = {
        layout: null,
    };

    res.render('student/student-calendar', data, (err, html)=>{
        if (err){
            res.status(500).send(`Error: ${err.message}`);
        } else {
            res.json(html);
        }
    });
});

router.get('/add', async(req,res)=>{
  const data = {
    layout: null,
  };
  
  res.render('student/join-class', data, (err, html)=> {
    if (err) {
      res.status(500).send(`Error: ${err.message}`)
    } else {
      res.json(html);
    }
  })
});

router.get('/course/:course_code', async(req, res) => {
  const courseCode = req.params.course_code;
  // Perform some db related logic

   

  const data = {
    // the db related stuff
    layout: null,
  };

  res.render('student/course-stream', data, (err, html)=> {
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  })

});

module.exports = router;
