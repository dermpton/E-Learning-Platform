const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectedDB = require('./lib/db');
const handlebars = require('express-handlebars').create({defaultLayout: 'admin'});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(express.json());
app.use(cookieParser());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname + '/views'));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET','POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const Student = require('./lib/models/student');
const Course = require('./lib/models/course');
const Teacher = require('./lib/models/teacher');

// testcase entries
const testData = require('./lib/testcases');
// testData();

app.get('/', (req, res)=>{
    res.render('landing-page', { layout: null });
});

app.use('/admin', require('./routes/admin'));
app.use('/student', require('./routes/student'));

app.get('/admin/:email', async(req, res)=> {
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

app.get('/student', async(req, res) =>{

  const data = {
    studentName: "John Doe",
    courseName: "Software Project Management",
    layout: 'student-dash',
  };

  res.render("student/initial",data);

});

app.get('/contact',(req, res) => {
  res.render('contact', {layout: null });
});

app.get('/courses', (req, res) => {
  res.render('course', { layout: null });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: null });
});

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).render('error', {message: err.message });
});

app.use((req, res)=>{
  res.status(404).render('error');
});

const startServer = async() => {
  try {
    // Make sure we wait for the database connection to be established
    const db = await connectedDB();
    
    // Only proceed if we have a connection
    if (db.readyState !== 1) {
      throw new Error('Database connection not established');
    }
    
    console.log("Database connected successfully");
    
    // Now that we're connected, we can seed the database
    // This won't close the connection anymore (removed from testData.js)
    await testData();
    
    const PORT = app.get('port');
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT} press ctrl + c to exit`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Add this to handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log it
});


