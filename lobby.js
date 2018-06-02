	module.exports = function(io, username, db) {
		console.log("welcome "+username);

		User = require('./public/models/user'); 
		Gameutils = require('./public/models/gameutils');

		var onlineUsers = [];

		/// SERVER SIDE ///
		var client = io.of('/lobby');

		Lobbychat = require('./public/models/lobbychat');

		var socketCounter = 0;

		client.on('connection', function(socket)
		{

			console.log("Counter conn: "+socketCounter);
			setOnline();
			socket.removeAllListeners();

				// Getting messages from database
				socket.on('getlobbymsgs', function(data){
					Lobbychat.getLobbyChats(data.lobby, function(err, lobbychat){
						if(err)
						{ console.log("Socket error occured."); }
						else
						{ 
							client.emit('outputlobbymsg', lobbychat); 
						} 	// Emit the messages
					});

				});

				// Getting messages from database
				socket.on('getonlines', function(data){
					updateOnlineList();
				});


			// Getting messages from database
				socket.on('getgames', function(data){
					Gameutils.getOnlineGames({'gamefinish': false},function(err,gameutil){
                    if(err)
                      {
                        console.log("annaerror",err)
                      }
                      else {
                      	client.emit('onlinegames', gameutil);
                       }
                    });

				});


 				// Handle input events when there is a new message
			 	socket.on('newlobbymessage', function(data){
			 		let message = data.message;
			 		var name = data.username;
			 			// Adding the message to the database
						Lobbychat.addLobbyMessage({lobbyname: name, lobbymessage: message}, function(err, msg){
							if(err)
							{
								console.log(err);
								res.send("An Error Occured");
							}
							else
							{
								client.emit('outputlobbymsg', [msg]);
			 				}

						});
			 	});

				function setOnline(){	
					console.log(username+" will be set online");
					User.setOnline({username: username}, {isonline:true}, {}, function(err, msg){
						if(err)
						{
							console.log(err);
							res.send("An Error Occured");
						}
						else
						{
							updateOnlineList();
						}
					});
				}

				function setOffline(){
					User.setOffline({username: username}, {isonline:false}, {},function(err, msg){
						if(err)
						{
							console.log(err);
							res.send("An Error Occured");
						}
						else
						{
							console.log("dondum de olmadi");
							updateOnlineList();
						}
					});
				}

				function updateOnlineList(){
					var where = { isonline: true };
					User.getOnlines(where, function(err, onlinelist){
						if(err)
						{ console.log("Socket error occured."); }
						else
						{
							console.log("online list:" + onlinelist);
							client.emit('outputonlines', onlinelist);
						}
					});
					
				}

				socket.on('disconnect', function () {
					console.log("disconnected!!");
					setOffline();
				});
			
		});

		/// SERVER SIDE END ////

	}
