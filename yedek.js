var express = require('express');
var app = express();
var router = express.Router();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');


router.get('/', function(req, res, next){
	res.render('index');
});

router.get('', function(req, res, next){

});


// mongod://localhost:PORT/DATABASE/
var url = 'mongodb://localhost:27017/test';

var users = [];
var user = [
	{
		id : 1,
		first_name : 'John',
		last_name : 'Doe',
		email: 'johndoe@gmail.com',
	},

	{
		id : 2,
		first_name : 'Jane',
		last_name : 'Doe',
		email: 'janedoe@gmail.com',
	},
	{
		id : 3,
		first_name : 'Bob',
		last_name : 'Smith',
		email: 'bobsmith@gmail.com',
	}
];

users = [];
connections = [];
	
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

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/get_map/lib/', express.static(__dirname + '/public/map/lib/'));
app.use('/get_map/data/', express.static(__dirname + '/public/map/data/'));

app.get('/', function(req, res){

res.sendFile(__dirname + '/public/index.html');

/* for json parsing
	res.render('index', {
		title: 'Customers',
		users: users
		});
*/


});


app.get('/get_map',function(req,res){
	res.sendFile(__dirname + '/public/map/index.html');
});

app.post('/users/add ',function(req,res){
	var newUser = {
		first_name : req.body.first_name,
		last_name : req.body.last_name,
		email : req.body.email,		
	}

	console.log(newUser);	
});

server.listen(3000, function(){
	console.log('Server has started on Port 3000.');
});
