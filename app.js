var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var db  = require('./config/db')
require('dotenv').config()
var QuestionRouter = require('./routes/routerquestions');
var CategoriesRouter = require('./routes/routercategories');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoDB = db.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
 //Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', [QuestionRouter, CategoriesRouter]);


module.exports = app;
