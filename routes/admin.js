const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Student = require('../lib/models/student');
const Teacher = require('../lib/models/teacher');
const Submission = require('../lib/models/submission');
const Assignment = require('../lib/models/assignment');
const Course = require('../lib/models/course');

const dummyJwt = 'iH=l@_,@]Mi=xNHDlp{H^TcQFbtShF';



async function authenticateInstructor(req, res, next){
  const { username, password } = req.body;
  console.log('Authentication User Running...'); 

  try {
    const teacher = await Teacher.findOne({ teachersName: username});
    if (!teacher) return res.status(401).json({success: false, msg: 'Invalid Username Credentials'});
    
    const teacherPassword = await bcrypt.compare(password, teacher.password);
    if (!teacherPassword) return res.status(401).json({success: false, msg: 'Invalid Credentials'});
  
    req.staff = teacher;
    token = jwt.sign({ teacherId: teacher._id }, process.env.JWT || dummyJwt, { expiresIn: '24h'});
    res.cookie('token', token, {
      httpOny: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    next();

  } catch(error) {
    console.error('Authentication error: ', error);
    return res.status(500).json({ success: false, msg: 'Server error during authentication'});
  }
};  

async function validateJwt(req, res, next){
  const token = req.cookies.token;
  console.log('Validate Jwt running, token exists', !!token);

  if(!token) return res.status(401).json({ success: false, msg: 'No token, Authorization denied'})
  
  try {
    const decoded = jwt.verify(token, process.env.JWT || dummyJwt);
    const teacher = await Teacher.findById(decoded.teacherId).select('-password');
    if(!teacher) res.status(401).json({ success: false, msg: 'Invalid token' });
    
    req.staff = teacher;
    next();
  } catch(err) {
    console.error('JWT validation error: ', err);
    res.status(401).json({ success: false, msg: 'Invalid token'});
  } 
}

router.get('/login', async(req, res)=>{
  res.render('login', { layout: null });
});

router.get('/signup', async(req, res)=>{
  res.render('login', { layout: null });
});

router.post('/login', async(req, res, next)=>{
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Username and password are required' });
  authenticateInstructor(req, res, next);
}, async (req, res) => {
  if (req.staff) {
    console.log(`User authenticated: ${req.staff.teachersName}`);
    return res.json({ success: true, redirectTo: '/admin'});
  }

  return res.status(400).json({ success: false, message: 'Login Failed' });
});

router.post('/signup', async(req, res, next)=>{
  const { username, email, password } = req.body;
  console.log('Signup attempt with: ', { username, email, password: password ? 'provided': 'missing'});
  if ( !email || !password || !username) return res.status(401).json({ success: false, msg: 'All fields must be populated'});
  
  try {
    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { teachersName: username }]});
    if (existingTeacher) return res.status(401).json({ success: false, message: 'Instructor already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newInstructor = await new Teacher({
      teachersName: username, 
      systemRole: 'Lecturer',
      announcements: [],
      feedback: [],
      adminSchool: 'National University of Science & Technology',
      email, 
      initialDate: new Date(),
      lastLogout: new Date(),
      password: hashedPassword,
    });

    await newInstructor.save();
    console.log(`New Instructor created: Welcome ${username}`);

    req.staff = newInstructor;

    const token = jwt.sign({ teacherId: newInstructor._id}, process.env.JWT || dummyJwt, { expiresIn: '24h'});
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ success: true, redirectTo: '/admin' });
  } catch (error) {
    console.error('Signup Error: ', error);
    return res.status(500).json({ success: false, msg: 'Server error during signup'});
  }
});

// From here-forth any personnel without their login details is prohibited
router.get('/', validateJwt , async(req, res)=>{
  const { teachersName, systemRole, announcements, feedback, adminSchool, email, initialDate, lastLogout } = req.staff;
  
  const data = {
    // will add just now
    teachersName,
    systemRole,
    studentTotal: 0,
    activeLearnerTotal: 0,
    courseName: '',
    addCourse: 'Web Development',
    studentCount: 0,
    announcements,
    feedback,
    adminSchool
  };

  res.render('home', data);
});

// router.get('/admin/:email', async(req, res)=> {
//   const data = {
//     teachersName: "John Doe",
//     systemRole: "Lecturer",
//     studentTotal: 130,
//     activeLearnerTotal: 72,
//     courseName: "Software Project Management",
//     addCourse: "Web Development",
//     getStudents: 130,
//     announcements: "Bob said: 'I forgot to submit the assignment' ",
//     feedback: "Average: 78%",
//     adminSchool: "National University of Science & Technology",
//   };

//   res.render('home', data);
// });

router.get('/students', validateJwt , async(req,res)=>{
  const {teachersName, systemRole} = req.staff;
  const data = {
    teachersName,
    systemRole,
    studentTotal: 8,
    courseName: "Software Project Management",
    getStudents: 3,
    adminSchool,
    studentName: ["Bob Ann", "John Smith", "Action Bronson"],
    layout: null,
  };
  
  res.render('students',data,(err, html) => {
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
      
    }
})});

router.get('/teacher', validateJwt , async(req, res)=> {
  const { teachersName, systemRole, announcements, feedback, adminSchool, email, initialDate, lastLogout } = req.staff;

  const data = {
    teachersName,
    email,
    systemRole,
    studentTotal: 130,
    courseName: "Software Project Management",
    getStudents: 130,
    adminSchool,
    getCourseIndex: 5,
    initialDate,
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

router.get('/calendar', validateJwt , async(req, res)=>{
  res.render('calendar', {layout: null}, (err, html)=>{
    if (err){
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });
});

router.get('/settings', validateJwt , async(req, res)=>{
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

router.get('/logout', validateJwt , (req,res)=>{
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

// TODO CREATE ASSIGNMENTS, COURSE-ENROLLMENT/CREATION

router.post('/create-assignment', validateJwt, async(req, res) =>{
  try {
    const { title, courseName, description, dateIssued, courseCode, dueDate, getTime } = req.body;
    
    const assignment = new Assignment({
      title,
      courseCode,
      courseName,
      description,
      dateIssued,
      dueDate,
      getTime,
    });

    await assignment.save();

    res.status(200).json({
      success: true, 
      message: 'Assignment created successfully',
      assignment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/create-assignment', validateJwt,  async (req, res) => {
  
  const data = {
    layout: null,

  };

  res.render('/add', data, (err, html)=>{
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });

});

router.post('/create-announcement', validateJwt, async(req, res) =>{
  try {
    const { title, courseName, description, dateIssued, courseCode, getTime } = req.body;
    
    const course = await Course.findOne({ instructorId: req.staff._id });
    if (!course) res.status(404).json({ error: 'Invalid Teacher'});
    
    const teacher = await Teacher.findOne({ teachersName: req.staff.teachersName });
    if (!teacher) res.status(404).json({ error: 'Invalid Teacher '});

    teacher.announcements.push(`Title: ${title}, Course: ${courseName}, Description: ${description}, Date: ${dateIssued}, Course Code: ${courseCode}, Time: ${getTime}`);
    await teacher.save();

    res.status(200).json({
      success: true, 
      message: 'Announcement created successfully',
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/create-announcement', validateJwt,  async (req, res) => {
  
  const data = {
    layout: null,

  };

  res.render('/add', data, (err, html)=>{
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });

});

router.post('/create-material', validateJwt, upload.single(), async(req, res) =>{
  try {
    const { title, courseName, description, dateIssued, courseCode, dueDate, getTime } = req.body;
    
    const assignment = new Assignment({
      title,
      courseCode,
      courseName,
      description,
      dateIssued,
      dueDate,
      getTime,
    });

    await assignment.save();

    res.status(200).json({
      success: true, 
      message: 'Assignment created successfully',
      assignment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/create-material', validateJwt,  async (req, res) => {
  
  const data = {
    layout: null,

  };

  res.render('/add', data, (err, html)=>{
    if (err) {
      res.status(500).send(`Error: ${err.message}`);
    } else {
      res.json(html);
    }
  });

});

router.post('/create-course', validateJwt , async(req, res)=>{
  try {
    const { courseName, description, courseCode, instructorId } = req.body;
    const course = new Course({
      courseName,
      description,
      courseCode,
      instructorId: req.staff._id, // trying to use the ObjectId from teacher model
    });

    await course.save();
    res.status(200).json({
      success: true,
      message: 'Course created successfully',
      course,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// TODO CREATE ASSIGNMENTS, COURSE-ENROLLMENT/CREATION


router.get('/add', validateJwt , async(req, res) => {
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