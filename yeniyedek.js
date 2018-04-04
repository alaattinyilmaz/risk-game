var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);	
var router = require('./router')(app);
var path = require('path');
var bodyParser = require('body-parser');

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bookstore');

var db = mongoose.connection;

app.use(router);


// Socket Handling
var users = [];
var connections = [];

io.sockets.on('connection', function(socket){

	// Adding socket to connections
	connections.push(socket);
  	console.log('Connected:'+ connections.length + ' sockets connected');

  	// Disconnection of socket
  	socket.on('disconnect', function(data){
  		// if(!socket.username) return;
  		users.splice(users.indexOf(socket.username), 1);
  		updateUsernames(); 	

  		connections.splice(connections.indexOf(socket), 1);
  		console.log('Disconnected '+ connections.length +' sockets connected  ');

	});

  	// Send Message
  	socket.on('send message', function(data){
  		console.log(data);
  		io.sockets.emit('new message', {msg: data, username: socket.username});
  	});

  	// New User 	
  	socket.on('new user', function(data, callback){
  		callback(true);
  		socket.username = data;
 		users.push(data);
 		updateUsernames();
  		console.log(data);
  	});

 	function updateUsernames ()
 	{
 		io.sockets.emit('get users', users)
 	}

});


app.listen(3000, function(){
	console.log('Server has started on Port 3000.');
});
