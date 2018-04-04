var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);	
var router = require('./router')(app);
var path = require('path');
//var bodyParser = require('body-parser');
//var game = require('./public/game');
// var mysocket = require('./mysocket');

app.use(router);
/*
// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
*/


/*
// Database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatdb');

var db = mongoose.connection;

var client = io.sockets;

io.sockets.on('connection', function(socket){
  	console.log('Socket connected.');
});
*/

//	Chat = require('./public/models/chats');

//	client.on('connection', function(socket){ 	
		 
		 
//		 console.log("connection occured"); 

		// let chat = db.collection('chats');
		/*
		 // Create function to send status
		 sendStatus = function(s)
		 {
		 	socket.emit('status', s);
		 }
		*/
		 //console.log(chat);

/*
		 // Get chats from mongo collection
		Chat.getChats(function(err, chats){
			if(err)	 		
			{ console.log("Socket error occured."); }
			else
			{ socket.emit('output', chats); } 	// Emit the messages
		});
*/

/*

	 // Handle input events
		 	socket.on('input', function(data){
		 		let name = data.name;
		 		let message = data.message;

		 		// Check for name and message
		 		if(name == '' || message == '')
		 		{
		 			sendStatus('Please enter a name and message');
		 		}
		 		else
		 		{

		 			//var msg = ; // Taking parameters from request body
					Chat.addMessage({name: name, message: message}, function(err, msg){
						if(err)
						{	
							console.log(err);
							res.send("An Error Occured"); 
						}
						else
						{ 
							console.log(msg);
							client.emit('output', [data]);
							// Send status object
			 				sendStatus({
			 					message: 'Message Sent',
			 					clear: true
			 				});

		 				 }

					});
					
		 		}

		 	});

		 	// Handle clear
		 	/*
		 	socket.on('clear', function(data){
		 		// Remove all chats from collection
		 		chat.remove({}, function(){
		 			socket.emit('cleared');
		 		});
			});
			

	});


*/

// BİR HATA VERİRSE SOCKET HANDLİNGİN AŞAĞISINA KADAR COMMENTE 

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


server.listen(3000, function(){
	console.log('Server has started on Port 3000.');
});
