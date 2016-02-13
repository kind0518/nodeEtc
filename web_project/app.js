var express = require('express');

var path = require('path');

var logger = require('morgan');
var bodyParser = require('body-parser');
var multer=require('multer');
//multer saves multiple variable.

var Members=require('./routes/Members');
var menu=require('./routes/menu');
var Community=require('./routres/Community');

var app = express();

//server router define.

app.set('views', path.join(__dirname,'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


