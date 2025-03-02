const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { title } = require('process');
const handlebars = require('express-handlebars').create({defaultLayout: 'admin'});
 
app.use(express.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname + '/public')));
app.set('views', path.join(__dirname + '/views'));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET','POST'],
  allowedHeaders: ['Content-Type'],
}));

// Routes
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');

app.get('/', (req, res)=>{
    res.render('landing-page', { layout: null });
});


app.use('/api',loginRouter);

app.get('/login',(req,res)=>{
  res.render('login',{layout: null });
});


app.use('/admin',adminRouter);


app.get('/admin', async(req, res)=> {
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

  res.render('home',data);
});

app.use('/student',studentRouter);



app.get('/student', async(req, res) =>{

  // const data = {
  //     layout: null,
  // };

  // if (req.xhr || req.headers.accept.indexOf('json') > -1){
  //   res.render('student-dash', data, (err, html) => {
  //     if (err){
  //       res.status(500).send(`Error: ${err.message}`);
  //     } else {
  //       res.json(html);
  //     }
  //   });
  // } 


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
})

app.listen(3000, ()=>{
  console.log(`Server started on http://localhost:3000 press ctrl + c to exit`);
});
