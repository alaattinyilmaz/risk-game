var express = require('express');
var app = express();
var router2 = require('./router2');

var server = require('http').Server(app);
var io = require('socket.io')(server);	

app.use(router2);

var path = require('path');	

var users = [];
var connections = [];

io.sockets.on('connection', function(socket){

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

  	// Send Message
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

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

server.listen(3000, function(){
	console.log('Server has started on Port 3000.');
});
