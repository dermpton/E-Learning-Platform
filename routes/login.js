const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();

app.use(express.json());

router.post('/login', (req, res)=>{
    const { email, password } = req.body;
    console.log(req.body);
    res.status(200).json({message: `This is the guy: ${email}`});
});

module.exports = router;
