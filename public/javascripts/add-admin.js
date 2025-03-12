// Serves the purpose of creating and handling assignments,
// announcements, and material (such as notes)


// Frontend

const handleFormSubmission = async (formId, url)=>{
    const form = document.getElementById(formId);

    const formData = new FormData(form);
    const studentData = {};

    for (let [key, value] of formData.entries()) {
        studentData[key] = value;
    }

    console.log('Details of Submission:', studentData);


}; 

// Express 
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');


const Course = require('../../lib/models/course');
const Assignment = require('../../lib/models/assignment');
const Teacher = require('../../lib/models/teacher');
const Submission = require('../../lib/models/submission');


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
