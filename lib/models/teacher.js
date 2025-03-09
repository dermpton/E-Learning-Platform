const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teachersName: { type: String, required: true},
    systemRole: String,
    announcements: [String],
    feedback: [String],
    adminSchool: { type: String, default: 'National University of Science & Technology'},
    email: { type: String, unique: true, required: true},
    initialDate: { type: Date, default: Date.now },
    lastLogout: Date,
    password: { type: String, required: true },
});


module.exports = mongoose.model('Teacher', teacherSchema);
