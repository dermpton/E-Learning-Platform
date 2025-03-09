const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dummyJwt = 'iH=l@_,@]Mi=xNHDlp{H^TcQFbtShF';

const Student = require('../lib/models/student');
const Course = require('../lib/models/course');
const Teacher = require('../lib/models/teacher');

async function authenticateUser(req, res, next){
  const { username, password } = req.body;
  console.log('Authentication User Ran but not the async await');
  // async won't run due to race conditions hence MongoNotConnectedError
  try{
    const student = await Student.findOne({ studentName: username });
    if (!student) return res.status(401).send('Invalid username Credentials');

    // TODO For debugging: comment out password checking
    // const studentPassword = await bcrypt.compare(password, student.password);
    // if (!studentPassword) return res.status(401).send('Invalid Credentials');
    
    req.user = student; // next middleware handler will have access
    
    const token = jwt.sign({student: student._id }, process.env.JWT || dummyJwt, { expiresIn: '24h' });
    // res.cookie() to the client frontend cookies using an object
    res.cookie('token', token, {httpOnly: true, secure: false}); // does not disrupt middleware
    
    next();
    // return res.json({success: true, redirectTo: '/student'});
  } catch(err) {
    console.log('Async got caught');
    return res.status(401).send('Invalid overall Credentials');
  }
}

async function validateJwt(req, res, next){
  // const authHeader = req.headers['Authorization'];
  
  // if (authHeader) {
  //   const accessToken = authHeader.split(' ')[1];
  // } 

  // try {
  //   const decoded = jwt.verify(accessToken, process.env.JWT || dummyJwt);
  //   const student = await Student.findById(decoded.studentId).select('-password');
  //   if (!student) {
  //     return res.status(403).json({ success: false, msg: 'Invalid Token'});
  //   }
  //   req.user = student;
  //   next();

  // } catch(error){
  //   res.status(401).json({msg: 'Invalid Token'});
  // }

  const token = req.cookies.token; // Attain the cookie that has the token
  console.log('Validate User Ran');
  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization denied'});
  }

  try {
    // validation entails you to decode wether the token is verified:
    // the following are the parameters: bearer (token) header & secret key
    const decoded = jwt.verify(token, process.env.JWT);
    const student = await Student.findById(decoded.studentId).select('-password');
    
    if (!student) return res.status(401).json({success: false, message: 'Invalid Token'});
    req.user = student;
    next();
  } catch(err){
    res.status(401).json({msg: 'Invalid Token'});
  }
}

router.get('/login', async(req, res)=>{
  res.render('student/student-login', { layout: null });
});

router.get('/signup', async(req, res)=>{
  res.render('student/student-login', { layout: null })
});

router.post('/login', authenticateUser, async(req, res)=>{

  if (req.user.username){
    console.log(`This is: ${req.user.username}`);
    return res.json({ success: true, redirectTo: '/student'});
  }
  console.error(`Something happened`);
  return res.status(400).json({success: false, message: 'Login Failed'});
});

router.post('/signup', 
  async(req, res, next)=>{
  const { username, email, password } = req.body;
    console.log('1st Middleware in /signup ran');
  try {
    const findEmail = await Student.findOne({email});
    if(findEmail) {
     return res.status(400).send('User already Exists');
    }

    const salt = await bcrypt.genSalt(10); // increases the randomness
    const hashedPassword = await bcrypt.hash(password, salt);
    const newStudent = new Student({studentName: username, email, password: hashedPassword});
    await newStudent.save();

    req.body.email = email;
    req.body.password = password;

    next();
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).send('Server Error in /signup');
  }
}, 

authenticateUser, 
async(req, res)=>{

  if(req.user.username) {
    console.log(`This is: ${req.user.username}`);
    return res.json({success: true, redirectTo: '/student'});
  }

  console.error('Something happened');
  return res.status(400).json({success: false, message: 'Sign in Failed'});
});

// From here-forth any personnel without their login details is prohibited
router.get('/', validateJwt, async(req, res) =>{

  const data = {
    studentName: "John Doe",
    courseName: "Software Project Management",
    layout: 'student-dash',
  };

  res.render("student/initial",data);

});

router.get('/home', validateJwt, async(req, res) => {
    
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

router.get('/add', validateJwt, async(req,res)=>{
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

router.get('/course/:course_code', validateJwt,async(req, res) => {
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

router.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).render('error', {message: err.message });
});

router.use((req, res)=>{
res.status(404).render('error');
});

module.exports = router;
