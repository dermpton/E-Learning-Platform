const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        // Add connection options - this is very important
        const conn = await mongoose.connect('mongodb://localhost:27017/e-learning-platform', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Added timeout and retry settings
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return mongoose.connection;
    } catch(err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;