var express = require('express');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.set('view engine', 'ejs');
var server = app.listen(3000, function(){
	console.log('\nServer has started on Port 3000. Time:', currentTime);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatdb');
var db = mongoose.connection;

var io = require('socket.io').listen(server);
var router = require('./router')(app,io,db);

var path = require('path');
var bodyParser = require('body-parser');

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
	cookie: {maxAge: 60000},
  store: new MongoStore({
    mongooseConnection: db
  })
}));
// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(router);

var date = new Date();
var currentTime = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
