const mongoose = require('mongoose');
const connectedDatabase = require('./db'); //immediate execution

const Teacher = require('./models/teacher');
const Student = require('./models/student');
const Assignment = require('./models/assignment');
const Course = require('./models/course');
const Submission = require('./models/submission');

const seedDatabase = async()=> {
    try {
        await Teacher.deleteMany({});
        await Student.deleteMany({});
        await Course.deleteMany({});
        await Course.deleteMany({});
        await Assignment.deleteMany({});
        await Submission.deleteMany({});

        console.log('Existing data cleared.');

        const teacher1 = await Teacher.create({
            teachersName: 'John Doe',
            systemRole: 'Admin',
            announcements: 'New Policy Updates',
            feedback: ['Awesome Work Team'],
            email: 'johndoe@example.com',
            password: 'hashed-password',
            initialDate: new Date(),
            lastLogout: new Date(),
        });
        console.log('Teachers inserted');
        const teacher2 = await Teacher.create({
            teachersName: 'Jane Smith',
            systemRole: 'Teacher',
            announcements: ['Assignment deadline will be extended'],
            feedback: ['Eli Needs Help'],
            email: 'janesmith@example.com',
            password: 'hashed-password',
            initialDate: new Date(),
            lastLogout: new Date(),
        });
        console.log('Teachers inserted');

        const student1 = await Student.create({
            adminSchool: 'National University of Science and Technology',
            announcements: ['Class rescheduled for Wednesday'],
            email: 'alicejohnson@example.com',
            feedback: ['I need help with Linear Algebra'],
            password: 'hashed-password',
            studentCount: 1,
            studentName: 'Alice Johnson',
        });

        console.log('Student Inserted');

        const student2 = await Student.create({
            adminSchool: 'Harvard University',
            announcements: ['Class rescheduled for Wednesday'],
            email: 'actionbronson@example.com',
            feedback: ['I need help with Calculus'],
            password: 'hashed-password',
            studentCount: 1,
            studentName: 'Action Bronson',
        });

        console.log('Student Inserted');

        const course1 = await Course.create({
                activeLearnerTotal: 2, 
                courseName: "Linear Algebra", 
                addCourse: ["Calculus"],
                courseCode: "SMA 1101",
                getCourseIndex: 1, 
                instructor: teacher1._id, // Link the teacher
                students: [student1._id, student2._id], //enrolled students
        });

        console.log('Course inserted');

        const assignment1 = await Assignment.create({
                title: "Open Book Test",
                courseName: course1._id,
                instructor: teacher2._id,
                description: "Solve the problems in the attached document, You have until lunch",
                attachment: 'linear-algebra.pdf', // keep a file path or a URL 
                dueDate: new Date("2025-03-10"), 
                dateIssued: new Date(), 
                courseCode: "SMA 1101", 
                getTime: new Date("2025-03-10").getTime(), 
                gradeTotal: '100 Points',
        });

        console.log('Assignment inserted');

        const submission1 = await Submission.create({
                student: student2._id,
                instructor: teacher2._id,
                assignment: assignment1._id,
                submissionDate: new Date(),
                submittedFile: "action_bronson_algebra_solution.pdf", // url to file path
                grade: 72, 
                feedback: "A bit hard but it was doable.",
        });

        console.log('Submissions inserted \n');
        console.log('Database test cases entered ');
        
        mongoose.connection.close();
    } catch(err) {
        console.error(`Error: ${err.message}`);
        mongoose.connection.close();
    }

};

module.exports = seedDatabase;

