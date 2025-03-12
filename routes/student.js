const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dummyJwt = 'iH=l@_,@]Mi=xNHDlp{H^TcQFbtShF';

const Student = require('../lib/models/student');
const Course = require('../lib/models/course');
const Teacher = require('../lib/models/teacher');
const Assignment = require('../lib/models/assignment');
const Submission = require('../lib/models/submission');
const multer = require('multer');
const path = require('path');


async function authenticateUser(req, res, next){
  const { username, password } = req.body;
  console.log('Authentication User Running...');
  
  try{
    const student = await Student.findOne({ studentName: username });
    if (!student) return res.status(401).json({ success: false, message: 'Invalid username Credentials' });

    const studentPassword = await bcrypt.compare(password, student.password);
    if (!studentPassword) return res.status(401).json({ success: false, message: 'Invalid password Credentials' });
    
    req.user = student; // next middleware handler will have access
    
    const token = jwt.sign({ studentId: student._id }, process.env.JWT || dummyJwt, { expiresIn: '24h' });
    // Set cookie with proper options
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax'
    });
    
    next();
  } catch(err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
}

async function validateJwt(req, res, next){
  const token = req.cookies.token; // Attain the cookie that has the token
  console.log('Validate JWT running, token exists:', !!token);
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, Authorization denied'});
  }

  try {
    // Verify token with the same secret used to sign it
    const decoded = jwt.verify(token, process.env.JWT || dummyJwt);
    const student = await Student.findById(decoded.studentId).select('-password');
    
    if (!student) return res.status(401).json({success: false, message: 'Invalid Token'});
    req.user = student;
    next();
  } catch(err){
    console.error('JWT validation error:', err);
    res.status(401).json({success: false, message: 'Invalid Token'});
  }
}

// TODO
// ========== EMERGENCY FALLBACK ROUTE (NO AUTH REQUIRED) ==========
router.get('/demo', async(req, res) => {
  try {
    // Create a mock user session without authentication
    const demoData = {
      studentName: "Demo Student",
      courseName: "Software Project Management",
      layout: 'student-dash',
      isDemoMode: true  // Indicate this is a demo
    };

    res.render("student/initial", demoData);
  } catch (err) {
    console.error('Demo route error:', err);
    res.status(500).send('Error loading demo mode');
  }
});

// ========== EMERGENCY LOGIN BYPASS ==========
router.post('/demo-login', async(req, res) => {
  try {
    // Create a static demo token
    const demoToken = jwt.sign(
      { studentId: 'demo-user-id', isDemoUser: true }, 
      process.env.JWT || dummyJwt, 
      { expiresIn: '1h' }
    );
    
    res.cookie('token', demoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return res.json({ 
      success: true, 
      redirectTo: '/student/demo',
      message: 'Demo mode activated' 
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ success: false, message: 'Error entering demo mode' });
  }
});
// TODO

router.get('/login', (req, res) => {
  res.render('student/student-login', { layout: null });
});

router.get('/signup', (req, res) => {
  res.render('student/student-login', { layout: null });
});

router.post('/login', async(req, res, next) => {
  // Validate request body first
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  
  // If validation passes, proceed to authentication
  authenticateUser(req, res, next);
}, async(req, res) => {
  // This only runs if authenticateUser called next()
  if (req.user) {
    console.log(`User authenticated: ${req.user.studentName}`);
    return res.json({ success: true, redirectTo: '/student' });
  }
  
  // Should not reach here due to error handling in authenticateUser
  return res.status(400).json({success: false, message: 'Login Failed'});
});

router.post('/signup', async(req, res, next) => {
  const { username, email, password } = req.body;
  console.log('Signup attempt with:', { username, email, password: password ? 'provided' : 'missing' });
  
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Username, email and password are required' });
  }
  
  try {
    const existingStudent = await Student.findOne({ $or: [{ email }, { studentName: username }] });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newStudent = new Student({
      studentName: username, 
      email, 
      password: hashedPassword,
      studentCount: 1, // Ensure required fields are set
      adminSchool: 'National University of Science & Technology',
      announcements: [],
      feedback: []
    });
    
    await newStudent.save();
    console.log('New student created:', username);
    
    // Set user for the next middleware
    req.user = newStudent;
    
    // Create and set JWT token
    const token = jwt.sign({ studentId: newStudent._id }, process.env.JWT || dummyJwt, { expiresIn: '24h' });
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax'
    });
    
    return res.json({ success: true, redirectTo: '/student' });
    
  } catch (err) {
    console.error(`Signup error: ${err}`);
    return res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// From here-forth any personnel without their login details is prohibited
router.get('/', validateJwt, async(req, res) =>{
  const data = {
    studentName: req.user.studentName,
    courseName: "Software Project Management",
    layout: 'student-dash',
  };

  res.render("student/initial", data);
});

router.get('/home', validateJwt, async(req, res)=>{
  const data = {
    layout: null,
  };

  res.render('student/course-overview', data, (err, html)=>{
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  })
});

router.get('/calendar', async(req, res)=>{

  res.render('student/student-calendar', { layout: null }, (err, html)=>{
    if (err) {
      return res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });
})

router.get('/add', validateJwt, async(req, res)=>{
  const data = {
    layout: null,
  }

  res.render('student/join-class', data, (err, html)=>{
    if(err) {
      return res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });
});

// TODO: NONE ROUTE RELATED LOGIC 

// storage area
const storage = multer.diskStorage({
    destination: async(req, file, cb)=>{
        try{
            cb(null, `uploads/assignments/${ await Teacher.findOne({email})}/${ await Course.findOne({instructor})}/`);
        } catch(err) {
            console.error(`Error: `, err.message);
            return; // for now
        }
    },
    filename: async(req, file, cb)=>{
        try {
            await cb(null, `${Date.now()}-${file.originalname}`);
        } catch (error) {
            console.error(`Error: `, err.message);
            return; // for now
        }
    }
});

const upload = multer({
    storage, 
    limits: {
        fileSize: 10 * 1024* 1024, // 10MB limit
        files: 2,
    },
    fileFilter: (req, file, cb)=>{
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|ppt|pptx|xls|xlsx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if ( mimetype && extname) {
            return cb(null, true);
        }
        cb (new Error('Invalid file format!'));
    }
});


// TODO: EOF NONE ROUTE RELATED LOGIC

router.post('/submit-assignment/:assignmentId', 
  validateJwt, 
  upload.single('assignment'), 
  async (req, res) => {
    const { feedback, submissionDate, instructor, studentId } = req.user;
    try {
      if (!req.file){
        return res.status(400).json({error: 'No file uploaded'});
      }

      const submission = new Submission({
        feedback,
        submissionDate,
        filePath: req.file.path,
        studentId,

      });
       
      await submission.save();

      res.status(200).json({
        success: true, 
        message: 'Assignment submitted successfully',
        submission,
      });

    } catch (error) {
      res.status(500).json({error: error.message});
    }
    
});

router.post('/enroll-course', validateJwt , async(req, res)=>{
  try {
    const { courseCode } = req.body;
    const studentId = req.user._id; 

    const course = await Course.findOne({ courseCode });
    if(!course) res.status(404).json({error: 'Invalid Course Code'})
  
    if (course.students.includes(studentId)) return res.status(400).json({ error: 'Already enrolled in this course' });
    
    course.students.push(studentId);
    await course.save();

    res.status(200).json({
      success: true, 
      message: 'Successfully enrolled in course',
      course,
    });

  } catch (error) {
    
  }
})

router.get('/course/:course_code', validateJwt, async(req, res)=>{
  const courseCode = req.params.course_code;
  const data = {
    layout: null, 
  };

  res.render('student/course-stream', data, (err, html)=>{
    if (err){
      return res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

module.exports = router;