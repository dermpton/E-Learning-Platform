const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const mongoose = require('mongoose'); 
const path = require('path');
const bodyParser = require('body-parser');
const { title } = require('process');
const handlebars = require('express-handlebars').create({defaultLayout: 'main'});
 
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json());
app.set('views', path.join(__dirname + '/views'));
app.use(cors());

app.get('/', (req, res)=>{
    res.render('login', { layout: null });
});

app.listen(app.get('port'), ()=>{
  console.log(`Server started on http://localhost:${app.get('port')} press ctrl + c to exit`);
});
