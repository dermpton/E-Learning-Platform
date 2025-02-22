const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); 
const { title } = require('process');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
 
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


const loginRouter = require('./routes/login');

app.get('/', (req, res)=>{
    res.render('landing-page', { layout: null });
});


app.use('/api',loginRouter);

app.get('/login',(req,res)=>{
  res.render('login',{layout: null });
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
