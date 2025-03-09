const express = require('express');
const mongoose = require('mongoose');

const connectDB = async() => {
    try {

        await mongoose.connect('mongodb://localhost:27017/e-learning-platform', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoose.connection.once('open', ()=>{
            console.log('MongoDB Connection succeeded');
        });

        // console.log('Database Connected: ', mongoose.connection.readyState);

    } catch(err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
