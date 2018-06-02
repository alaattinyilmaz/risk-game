	module.exports = function(io, gameid, username, howmany, maplevel, db) {

	/*// Database connection
	const mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/chatdb');
	var db = mongoose.connection;*/

	var client = io.of('/'+gameid);
	var socketCounter = 0;

		// Database table models
		Chat = require('./public/models/chat');
		Territory = require('./public/models/territory');
		Gameutils = require('./public/models/gameutils');
		Player = require('./public/models/players');

		//let gameid = 1; // Will be change!
		isGameFinish = false;
		socketEvents();
		loadTerritories();

	// Getting all the territories and posting to the client
	function initialInfantryDeployment(){
	//	var where = {gameid: gameid};
		Territory.getAllTerritories(gameid, function(err, territories){
			if(err)
			{ console.log("Socket error occured."); }
			else
			{
				//console.log(territories);
				client.emit('updatedterritory', territories);
			}
		});
			//client.emit('getplayers', players);
	}

	  // Each territory has a territoryid, continent, territory name, number of soldiers on it and who belongs to playerid (-1 means nobody)
	var territories, players,gameutil;

	function loadTerritories(){
	  function Territory (gameid, tid, continent, tname, neighbors, infantry, ownsto){
	    this.gameid = gameid;
	    this.tid = tid;
	    this.continent = continent;
	    this.tname = tname;
	    this.neighbors = neighbors;
	    this.infantry = infantry;
	    this.ownsto = ownsto;
	  }

	if(maplevel == "hard" || maplevel == "easy") // TODO: Custom map for easy will be implemented!
	{
	// All territories with their neighbors for 41 Territories
	  var TER0 = new Territory(gameid, 0, 0,'Venezuela',  [ 4, 1, 2 ] , 0, -1);
	  var TER1 = new Territory(gameid, 1, 0,'Brazil',  [ 3, 0, 1, 2, 13 ] , 0, -1);
	  var TER2 = new Territory(gameid, 2, 0,'PERU',  [ 3, 0, 1 ] , 0, -1);
	  var TER3 = new Territory(gameid, 3, 0,'Argentina',  [ 0, 1, 2 ] , 0, -1);
	  var TER4 = new Territory(gameid, 4, 1,'Mexico',  [ 6, 0, 5 ] , 0, -1);
	  var TER5 = new Territory(gameid, 5, 1,'Western United States',  [ 6, 4, 11, 10 ] , 0, -1);
	  var TER6 = new Territory(gameid, 6, 1,'Eastern United States',  [ 10, 7, 5 ] , 0, -1);
	  var TER7 = new Territory(gameid, 7, 1,'Eastern Canada',  [ 6, 10, 40 ] , 0, -1);
	  var TER8 = new Territory(gameid, 8, 1,'Alaska',  [ 9, 11, 0, 32] , 0, -1);
	  var TER9 = new Territory(gameid, 9, 1,'North West Territory',  [ 8, 11, 10, 40 ] , 0, -1);
	  var TER10 = new Territory(gameid, 10, 1, 'Ontario',  [ 6, 11, 5, 7, 9, 40 ] , 0, -1);
	  var TER11 = new Territory(gameid, 11, 1, 'Alberta',  [ 10, 8, 9, 5 ] , 0, -1);
	  var TER12 = new Territory(gameid, 12, 4, 'Egypt',  [ 19, 17, 13, 14 ] , 0, -1);
	  var TER13 = new Territory(gameid, 13, 4, 'North Africa',  [ 18, 1, 12, 14, 15 ] , 0, -1);
	  var TER14 = new Territory(gameid, 14, 4, 'East Africa',  [ 12, 17, 27, 15, 13 ] , 0, -1);
	  var TER15 = new Territory(gameid, 15, 4, 'Congo',  [ 13, 16, 14 ] , 0, -1);
	  var TER16 = new Territory(gameid, 16, 4, 'South Africa',  [ 15, 27, 14 ] , 0, -1);
	  var TER17 = new Territory(gameid, 17, 2, 'Middle East',  [ 12, 14, 25, 26, 20, 19 ] , 0, -1);
	  var TER18 = new Territory(gameid, 18, 3, 'Western Europe',  [ 13, 19, 22 ] , 0, -1);
	  var TER19 = new Territory(gameid, 19, 3, 'Southern Europe',  [ 12, 17, 22, 19, 20 ] , 0, -1);
	  var TER20 = new Territory(gameid, 20, 3, 'Ukraine',  [ 31, 26, 17, 21, 22, 19 ] , 0, -1);
	  var TER21 = new Territory(gameid, 21, 3, 'Scandinavia',  [ 20, 22, 24, 23 ] , 0, -1);
	  var TER22 = new Territory(gameid, 22, 3, 'Northern Europe',  [ 23, 21, 19, 18, 20 ] , 0, -1);
	  var TER23 = new Territory(gameid, 23, 3, 'Great Britain',  [ 24, 21, 22 ] , 0, -1);
	  var TER24 = new Territory(gameid, 24, 3, 'Iceland',  [ 40, 23, 21 ] , 0, -1);
	  var TER25 = new Territory(gameid, 25, 2, 'India',  [ 17, 26, 29, 28 ] , 0, -1);
	  var TER26 = new Territory(gameid, 26, 2, 'Afghanistan',  [ 17, 20, 31, 25, 29 ] , 0, -1);
	  var TER27 = new Territory(gameid, 27, 4, 'Madagascar',  [ 16, 14 ] , 0, -1);
	  var TER28 = new Territory(gameid, 28, 2, 'Siam',  [ 37, 25, 29 ] , 0, -1);
	  var TER29 = new Territory(gameid, 29, 2, 'China',  [ 26, 28, 25, 34, 31, 30 ] , 0, -1);
	  var TER30 = new Territory(gameid, 30, 2, 'Mongolia',  [ 29, 34, 35, 32, 36 ] , 0, -1);
	  var TER31 = new Territory(gameid, 31, 2, 'Ural',  [ 20, 34, 26, 29 ] , 0, -1);
	  var TER32 = new Territory(gameid, 32, 2, 'Kamchatka',  [ 8, 36, 35, 33, 30 ] , 0, -1);
	  var TER33 = new Territory(gameid, 33, 2, 'Yakutsk',  [ 35, 32, 34 ] , 0, -1);
	  var TER34 = new Territory(gameid, 34, 2, 'Siberia',  [ 31, 33, 35, 30, 29 ] , 0, -1);
	  var TER35 = new Territory(gameid, 35, 2, 'Irutsk',  [ 30, 33, 34, 32 ] , 0, -1);
	  var TER36 = new Territory(gameid, 36, 2, 'Japan',  [ 0, 30 ] , 0, -1);
	  var TER37 = new Territory(gameid, 37, 5, 'Indonesia',  [ 28, 38, 39 ] , 0, -1);
	  var TER38 = new Territory(gameid, 38, 5, 'New Guinea',  [ 37, 39 ] , 0, -1);
	  var TER39 = new Territory(gameid, 39, 5, 'Australia',  [ 37, 38 ] , 0, -1);
	  var TER40 = new Territory(gameid, 40, 1, 'Greenland',  [ 9, 10, 7, 24 ] , 0, -1);


	  territories = [TER0,TER1,TER2,TER3,TER4,TER5,TER6,
	             TER7,TER8,TER9,TER10,TER11,TER12,TER13,
	             TER14,TER15,TER16,TER17,TER18,TER19,TER20,
	             TER21,TER22,TER23,TER24,TER25,TER26,TER27,
	             TER28,TER29,TER30,TER31,TER32,TER33,TER34,
	             TER35,TER36,TER37,TER38,TER39,TER40];
	}
	else if (maplevel == "medium"){
	//31 countries
	// Continents: 0: south america, 1: north america, 2: asia, 3: europe, 4: africa, 5: ocenia
	var TER0 = new Territory(gameid, 0, 0, 'Veneru',  [ 1, 2, 3 ] , 0, -1);
	var TER1 = new Territory(gameid, 1, 0, 'Brazil',  [ 0, 2, 10 ] , 0, -1);
	var TER2 = new Territory(gameid, 2, 0, 'Argentina',  [ 0, 1 ] , 0, -1);
	var TER3 = new Territory(gameid, 3, 1, 'Western United States',  [ 0, 4, 7 ] , 0, -1);
	var TER4 = new Territory(gameid, 4, 1, 'Eastern United States',  [ 3, 5, 7 ] , 0, -1);
	var TER5 = new Territory(gameid, 5, 1, 'Eastern Canada',  [ 7, 4, 29 ] , 0, -1);
	var TER6 = new Territory(gameid, 6, 1, 'North Canada',  [ 7, 23, 29 ] , 0, -1);
	var TER7 = new Territory(gameid, 7, 1, 'Southwestern Canada',  [ 6, 5, 4, 3, 29 ] , 0, -1);
	var TER8 = new Territory(gameid, 8, 4, 'Middle Africa',  [ 9, 10, 21, 11 ] , 0, -1);
	var TER9 = new Territory(gameid, 9, 4, 'Egypt',  [ 10,12,8, 14 ] , 0, -1);
	var TER10 = new Territory(gameid, 10, 4, 'North Africa',  [  1, 9, 13, 14 ] , 0, -1);
	var TER11 = new Territory(gameid, 11, 4, 'South Africa',  [ 8,21 ] , 0, -1);
	var TER12 = new Territory(gameid, 12, 2, 'Middle East',  [ 14, 9, 8, 20, 30 ] , 0, -1);
	var TER13 = new Territory(gameid, 13, 3, 'Western Europe',  [ 18, 10, 14 ] , 0, -1);
	var TER14 = new Territory(gameid, 14, 3, 'Middle Europe',  [ 18, 13, 15, 16, 12, 9 ] , 0, -1);
	var TER15 = new Territory(gameid, 15, 3, 'Ukraine',  [ 16, 12, 14, 30] , 0, -1);
	var TER16 = new Territory(gameid, 16, 3, 'Scandinavia',  [ 15, 19, 14, 18 ] , 0, -1);
	var TER17 = new Territory(gameid, 17, 2, 'Middle Russia',  [ 24, 23, 22 ] , 0, -1);
	var TER18 = new Territory(gameid, 18, 3, 'Great Britain',  [ 19, 14, 16,13 ] , 0, -1);
	var TER19 = new Territory(gameid, 19, 3, 'Iceland',  [ 29, 18, 16 ] , 0, -1);
	var TER20 = new Territory(gameid, 20, 2, 'India',  [ 26, 22, 12, 30 ] , 0, -1);
	var TER21 = new Territory(gameid, 21, 4, 'Madagascar',  [ 11, 8 ] , 0, -1);
	var TER22 = new Territory(gameid, 22, 2, 'China',  [ 25, 17, 23, 26, 20, 24,30 ] , 0, -1);
	var TER23 = new Territory(gameid, 23, 2, 'Kamchatka',  [ 6, 25, 22, 17 ] , 0, -1);
	var TER24 = new Territory(gameid, 24, 2, 'Siberia',  [ 22, 17, 30] , 0, -1);
	var TER25 = new Territory(gameid, 25, 2, 'Japan',  [ 23, 22 ] , 0, -1);
	var TER26 = new Territory(gameid, 26, 5, 'Indonesia',  [ 22, 28, 27,20 ] , 0, -1);
	var TER27 = new Territory(gameid, 27, 5, 'New Guinea',  [ 26, 28 ] , 0, -1);
	var TER28 = new Territory(gameid, 28, 5, 'Australia',  [ 26, 27 ] , 0, -1);
	var TER29 = new Territory(gameid, 29, 1, 'Greenland',  [ 19, 5, 6 , 7  ] , 0, -1);
	var TER30 = new Territory(gameid, 30, 2, 'Western Asia',  [ 24, 12, 15, 20, 22 ] , 0, -1);

	territories = [TER0,TER1,TER2,TER3,TER4,TER5,TER6,
					   TER7,TER8,TER9,TER10,TER11,TER12,TER13,
					   TER14,TER15,TER16,TER17,TER18,TER19,TER20,
					   TER21,TER22,TER23,TER24,TER25,TER26,TER27,
					   TER28,TER29,TER30];
	}

/*
	else if(maplevel == "easy")
	{
		var TER0 = new Territory(gameid, 0, 0, 'Brasil', [1, 2, 7], 0, -1);
		var TER1 = new Territory(gameid, 1, 0, 'Argentina', [0], 0, -1);
		var TER2 = new Territory(gameid, 2, 1, 'Mexico', [0, 3], 0, -1);
		var TER3 = new Territory(gameid, 3, 1, 'United States', [2, 4], 0, -1);
		var TER4 = new Territory(gameid, 4, 1, 'Canada', [3, 6, 5], 0, -1);
		var TER5 = new Territory(gameid, 5, 1, 'Alaska', [4, 15], 0, -1);
		var TER6 = new Territory(gameid, 6, 1, 'Greenland', [4, 10], 0, -1);
		var TER7 = new Territory(gameid, 7, 4, 'North Africa', [0, 9, 13, 8], 0, -1);
		var TER8 = new Territory(gameid, 8, 4, 'South Africa', [7], 0, -1);
		var TER9 = new Territory(gameid, 9, 3, 'Western Europe', [12, 10, 7, 11], 0, -1);
		var TER10 = new Territory(gameid, 10, 3, 'United Kingdom', [6, 9, 11, 14], 0, -1);
		var TER11 = new Territory(gameid, 11, 3, 'Northern Europe', [12, 10, 9, 15, 14], 0, -1);
		var TER12 = new Territory(gameid, 12, 3, 'Eastern Europe', [13, 11, 9], 0, -1);
		var TER13 = new Territory(gameid, 13, 3, 'Middle East', [7, 12, 15, 16], 0, -1);
		var TER14 = new Territory(gameid, 14, 3, 'Scandinavia', [11, 15, 10], 0, -1);
		var TER15 = new Territory(gameid, 15, 2, 'Russia', [14, 11, 16, 5], 0, -1);
		var TER16 = new Territory(gameid, 16, 2, 'Middle Asia', [15, 17, 13, 18], 0, -1);
		var TER17 = new Territory(gameid, 17, 2, 'India', [18, 16], 0, -1);
		var TER18 = new Territory(gameid, 18, 2, 'China', [19, 15, 17, 16], 0, -1);
		var TER19 = new Territory(gameid, 19, 5, 'Australia', [18], 0, -1);

		territories = [TER0,TER1,TER2,TER3,TER4,TER5,TER6,
						   TER7,TER8,TER9,TER10,TER11,TER12,TER13,
						   TER14,TER15,TER16,TER17,TER18,TER19];
	}

	*/


	    function Player(gameid, pid, name, infantry, territories){
	    	this.gameid = gameid;
		    this.pid = pid;
		    this.name = name;
		    this.infantry = infantry;
		    this.territories = territories;
	  	}


		  	  // Dummy players
	          var PLAYER1 = new Player(gameid,0, username, 20, []);
	          var PLAYER2 = new Player(gameid,1, "x", 20, []);
	          var PLAYER3 = new Player(gameid,2, "x", 20, []);
	          var PLAYER4 = new Player(gameid,3, "x", 20, []);
	          var PLAYER5 = new Player(gameid,4, "x", 20, []);
	          var PLAYER6 = new Player(gameid,5, "x", 20, []);

	        let howManyPeople = howmany;
	        // INITIAL SETUP HOW MANY PEOPLE
	        if(howManyPeople==2){
	          players= [PLAYER1,PLAYER2];
	        }
	        else if(howManyPeople==3)
	        {
	          players = [PLAYER1,PLAYER2,PLAYER3];
	        }
	        else if(howManyPeople==4)
	        {
	          players = [PLAYER1,PLAYER2,PLAYER3,PLAYER4];
	        }
	        else if(howManyPeople==5)
	        {
	          players = [PLAYER1,PLAYER2,PLAYER3,PLAYER4,PLAYER5];
	        }
	        else if(howManyPeople==6)
	        {
	          players = [ PLAYER1,PLAYER2,PLAYER3,PLAYER4,PLAYER5,PLAYER6];
	        }

		  let territoryCount = territories.length;
		  let playerCount = howManyPeople;

	  // Assumed 3 people is playing
	  let firstEachInfantry = Math.floor(60/40 + 1);

	  // Predetermined infantry deployment for the initial map
	    for (var i = 0, j = 0; i < territories.length; i++){
	      territories[i].ownsto = j;
	      territories[i].infantry++;
	      players[j].territories.push(i); // Territory added to that player
	      players[j].infantry--;
	      j++;
	      if(j == howManyPeople)
	      { j = 0; }
	    }

	  // Infantry deployment continues for the first turn
		for (var i = 0; i < playerCount; i++){
			//console.log(players[i].territories)
		    for (var j = 0; j < players[i].territories.length; j++){
		    	var tobeput = Math.floor(players[i].infantry/players[i].territories.length+1);
		    	territories[players[i].territories[j]].infantry +=  tobeput;
		    	//console.log(territories[players[i].territories[j]].infantry);
		    	players[i].infantry -= tobeput;
		    }
		    var occupiedTerritoryNum = players[i].territories.length;
		    players[i].infantry = Math.floor(occupiedTerritoryNum/3); // Initially players have no infantry for the first turn to be played by users
		}

	/*
	// END GAME CONDITION
		for (var i = 0; i < territories.length-1; i++){
			territories[i].ownsto = 1;
			territories[i].infantry = 20;
			players[1].territories.push(i);
		}
		territories[territories.length-1].infantry = 1;
		territories[territories.length-1].ownsto = 2;
		players[2].territories.push(territories.length-1);

	*/

	var pids = [];
	var pnames = [];
	for (var k = 0; k < players.length; k++){
		pids.push(k);
	}

	for (var t = 0; t < players.length; t++){
		pnames.push(players[t].name);
	}

	gameutil = {gameid: gameid, currentplayer: 0, currentphase: -1, players: pids, playernames: pnames, gamefinish: false, howmany:howmany, maplevel:maplevel, creater:username};

	}
		// Adding the territories into database
		Gameutils.addGameUtil(gameutil, function(err, docs){
			if(err)
			{
			 console.log("Territories could not be created."); }
			else
			{
				Gameutils.getCurrentGameid(gameid,function(err,id){
				if(err)
				{console.log("annaerror",err)}
				else {
					console.log(id[0].gameid + " gameid budur");
				}


				});
			}
		});


		// Adding the territories into database
		Territory.createTerritories(territories, function(err, docs){
			if(err)
			{
			 console.log("Territories could not be created."); }
			else
			{
				//console.log(docs);
			}
		});

		Player.createPlayers(players, function(err, docs){
			if(err)
			{
			 console.log("Players could not be created."); }
			else
			{
				//console.log(docs);
			}
		});


		

	  		function isRoomFull(){
	  			for(var j = 1; j < howmany; j++)
	  			{
                  if(players[j].name == 'x')
                  {
                    sendStatus("We are still waiting for some people!");
                    return false;
                  }
	  			}
	  			return true;
	  		}


	  		function joinGame(recievedUsername){

	  			if(recievedUsername != username) {
	  		
		  		if(!isRoomFull())
		  		{
		  				for(var i = 1; i < howmany;i++)
		  				{
		  					if(players[i].name == "x")
		  					{
		  						console.log(players[i].name);
		  						players[i].name = recievedUsername;
		  						client.emit('getplayers', players);
		  						gameLog(recievedUsername+" has joined the game.");
		  						console.log(recievedUsername+" has joined the game.");
		  						return;
		  					}
		  				}

		  		}

				else{
		  				gameLog(recievedUsername+" has joined the game as visitor.");
		  				sendStatus(recievedUsername+", the room is full please go to another room.");
		  			}

	  			}
	  		}



	function socketEvents(){

		client.on('connection', function(socket)
		{
			socketCounter++;
			socket.removeAllListeners();

			//socket.join(gameid);

			initialInfantryDeployment();

			// Getting messages from database
			socket.on('getmsgs', function(data){
				Chat.getChats(data.gameid, function(err, chats){
					if(err)
					{ console.log("Socket error occured."); }
					else
					{ //console.log(chats);
					socket.emit('outputmsg', chats); } 	// Emit the messages
				});

			});

			 sendStatus = function(s)
			 {
			 	console.log(s);
			 	client.emit('serverstatus', [s]);
			 }
			


			 gameLog = function(s)
			 {
			 	console.log(s);
				client = io.of('/'+gameid);
			 	client.emit('gamelog', [s]);
			 }

			 //joinGame(username);


			 socket.on('joingame', function(data){
			 	console.log("joingame is called by ,"+data.username);
			 	joinGame(data.username);
			 });

			 	// Reinforcement call
			 	socket.on('reinforcement', function(data){
			 			let playerid = data.pid;
			 			let tid = data.tid;
						var updateOnPlayer = {};
						var playerwhere = {gameid: gameid, playerid: playerid};
						// First decreasing of infantry units of the player
			 			Player.decreaseInfantry(playerwhere, updateOnPlayer, {}, function(err, player){
							if(err == 800)
							{
								sendStatus("You do not have any infantry left!!");
							}

							else
							{
								var updateOnTerritory = {};
								var where = {tid:tid, gameid:gameid};
								// Putting infantry on the territory
					 			Territory.putInfantry(where, updateOnTerritory, {}, function(err, territory){
									if(err)
									{
										console.log(err);
										sendStatus('An error occured.');
									}
									else
									{
										// console.log(territories[tid]);
										 client.emit('leftinfantry', [player]);
										 client.emit('updatedterritory', [territory]);
										 territories[tid] = territory; // Updating the local territory array
									}
								});

							   //client.emit('currentplayer', [[gameutil]]);
							}
						});

			 	});



				socket.on('startWar', function(data){
				//let gameid = data.gameid;
					if(data != undefined) {
					var attackTerritory = data.attacker;
					var defenseTerritory = data.defender;
				//	var attackTerritoryWhere = {gameid : gameid, tid : data.attacker};
					//var defenseTerritoryWhere = {gameid: gameid, tid : data.defender};
					var attackPlayerId = territories[attackTerritory].ownsto;
					var defensePlayerId = territories[defenseTerritory].ownsto;
					var updateOnPlayer = {};
					var updateOnTerritory = {};
					var attackArmies = territories[attackTerritory].infantry;
					var defenseArmies = territories[defenseTerritory].infantry;
					var battle=function(attack,defense){
					var a=0;
					var d=0;
					//roll attack dice
					var attackDice= new Array();
					for (a=1; a <= attack; a++){
						attackDice[a]=Math.floor(Math.random()*6)+1;
						if(a===1){
							attackHigh=attackDice[1];
						//	console.log("Condition A1");
						}
						else if(a===2){
							attackHigh=Math.max(attackDice[1],attackDice[2]);
							attackLow=Math.min(attackDice[1],attackDice[2]);
						//	console.log("Condition A2");
						}
						else if (a===3){
							attackHigh=Math.max(attackDice[1], attackDice[2],attackDice[3]);
							attackDice.sort();
							//console.log(attackDice);
							attackLow=attackDice.slice(1,2);
						//	console.log("Condition A3");
						}
					}

					//roll defense dice
					var defenseDice= new Array();
					for (d=1; d <= defense; d++){
						defenseDice[d]=Math.floor(Math.random()*6)+1;

						if(d===1){
							defenseHigh=defenseDice[1];
						//	console.log("Condition D1");
						}
						else if(d===2){
							defenseHigh=Math.max(defenseDice[1],defenseDice[2]);
							defenseLow=Math.min(defenseDice[1],defenseDice[2]);
						//console.log(defenseDice);
					//	console.log("Condition D2");

						}

					}

					//compare attack and defense
					if (attackHigh > defenseHigh){
						defenseArmies--;
						sendStatus(players[territories[attackTerritory].ownsto].name+" has won the battle against "+players[territories[defenseTerritory].ownsto].name);
						gameLog(players[territories[attackTerritory].ownsto].name+" has won the battle against "+players[territories[defenseTerritory].ownsto].name+" "+gameid+ " ["+ getTime() +"]");
						//console.log("D Loses");
					}
					else{
						attackArmies--;
						sendStatus(players[territories[defenseTerritory].ownsto].name+" has defended himself against "+players[territories[attackTerritory].ownsto].name);
						gameLog(players[territories[defenseTerritory].ownsto].name+" has defended himself against "+players[territories[attackTerritory].ownsto].name + " "+gameid+" ["+ getTime() +"]");
						//console.log("A Loses");
					}

					//compare if 2 dice
					if (a>2 && d>2){
						if (attackLow > defenseLow){
						defenseArmies--;
						sendStatus(players[territories[attackTerritory].ownsto].name+" has won the battle against "+players[territories[defenseTerritory].ownsto].name);
						gameLog(players[territories[attackTerritory].ownsto].name+" has won the battle against "+players[territories[defenseTerritory].ownsto].name + " "+gameid+" ["+ getTime() +"]");
						//console.log("D Loses");
					}
					else{
						attackArmies--;
						sendStatus(players[territories[defenseTerritory].ownsto].name+" has defended himself against "+players[territories[attackTerritory].ownsto].name);
						gameLog(players[territories[defenseTerritory].ownsto].name+" has defended himself against "+players[territories[attackTerritory].ownsto].name + " "+gameid+" ["+ getTime() +"]");
						//console.log("A Loses");
					}
					}
					//console.log(a,' Attackers vs. ',d,"Defenders");

					if(attackArmies>1 && defenseArmies>0){
						var updateOnAttackTerritory = {infantry: attackArmies, ownsto: territories[attackTerritory].ownsto};
						var attackTerritoryWhere = {gameid: gameid, tid: attackTerritory};
						setTerritoryInfantry(attackTerritoryWhere, updateOnAttackTerritory);

						var updateOnDefenseTerritory = {infantry: defenseArmies, ownsto: territories[defenseTerritory].ownsto};
						var defenseTerritoryWhere = {gameid: gameid, tid: defenseTerritory};
						setTerritoryInfantry(defenseTerritoryWhere, updateOnDefenseTerritory);
					}
					else if(attackArmies == 1 && defenseArmies>0){
						var updateOnAttackTerritory = {infantry: attackArmies, ownsto: territories[attackTerritory].ownsto};
						var attackTerritoryWhere = {gameid: gameid, tid: attackTerritory};
						setTerritoryInfantry(attackTerritoryWhere, updateOnAttackTerritory);

						var updateOnDefenseTerritory = {infantry: defenseArmies, ownsto: territories[defenseTerritory].ownsto};
						var defenseTerritoryWhere = {gameid: gameid, tid: defenseTerritory};
						setTerritoryInfantry(defenseTerritoryWhere, updateOnDefenseTerritory);
					}
					else if(defenseArmies == 0){
						var updateOnAttackTerritory = {infantry: 1, ownsto: territories[attackTerritory].ownsto};
						var attackTerritoryWhere = {gameid: gameid, tid: attackTerritory};
						//console.log(attackTerritoryWhere);
						//console.log("yukarida bakiniz");
						setTerritoryInfantry(attackTerritoryWhere, updateOnAttackTerritory);
					//	console.log(territories[attackTerritory].infantry);
						var updateOnDefenseTerritory = {infantry: attackArmies-1, ownsto: territories[attackTerritory].ownsto};
						var defenseTerritoryWhere = {gameid: gameid, tid: defenseTerritory};
						setTerritoryInfantry(defenseTerritoryWhere, updateOnDefenseTerritory);

						var playerid = territories[attackTerritory].ownsto;
						var updateOnPlayer = { $push: { territories: defenseTerritory } };

						var playerwhere = {gameid: gameid, playerid :playerid};
					Player.pushTerritoryToPlayer(playerwhere, updateOnPlayer, {}, function(err, player){
						if(err)
						{
							console.log(err);
							sendStatus('An error occured.');
						}
						else
						{
							players[playerid] = player; // Updating the local territory array
							client.emit('leftinfantry', [player]);

							if(player.territories.length == territories.length){
								isGameFinish = true;
								var gameFinish = { winner: player.pid };
								client.emit('gamefinish', [gameFinish]);
							}

						}
					});
			}};

				if (attackArmies>3 ){
						attack=3;
					}
					else if (attackArmies===3){
						attack=2;
					}
					else if (attackArmies===2){
						attack=1;
					}
			//Determine number of Defense dice
				if(defenseArmies>1){
					defense=2;
				}
				else if(defenseArmies===1){
					defense=1;
				}
			battle(attack,defense);
			console.log("Remaining Attackers:",attackArmies,"Remaining Defenders:",defenseArmies);
			}
		});

			function setTerritoryInfantry(changedTerritory,updateOnTerritory){
				Territory.setTerritoryInfantry(changedTerritory, updateOnTerritory, {}, function(err, territory){
						if(err)
						{
							console.log(err);
							sendStatus('An error occured.');
						}
						else
						{
							// console.log(territories[changedTerritory]);
							 //client.emit('leftinfantry', [player]);
							 territories[changedTerritory.tid] = territory;
							 client.emit('updatedterritory', [territory]);
							 // Updating the local territory array
						}
					});
			}

			 	// Gets currentplayer from database and sends to the all clients
			 	socket.on('fortification', function(data){
			 		var fortifyTerritoryFromWhere = {gameid:gameid ,tid :data.fortifyfrom};
			 		var fortifyTerritoryToWhere = {gameid:gameid ,tid:data.fortifyto};
					var fortifyTerritoryFrom = data.fortifyfrom;
					var fortifyTerritoryTo = data.fortifyto;
			 		var amount = parseInt(data.amount);

			 		var frominfantry = territories[fortifyTerritoryFromWhere.tid].infantry - amount;
					var toinfantry = territories[fortifyTerritoryToWhere.tid].infantry + amount;

				 	var updateOnFromTerritory = {infantry: frominfantry};
					setTerritoryInfantry(fortifyTerritoryFromWhere, updateOnFromTerritory);

				 	var updateOnToTerritory = {infantry: toinfantry};
					setTerritoryInfantry(fortifyTerritoryToWhere, updateOnToTerritory);

					gameLog(players[territories[fortifyTerritoryFrom].ownsto].name + " fortified " + amount + " infantries from " + territories[fortifyTerritoryFrom].tname +" to " + territories[fortifyTerritoryTo].tname +" "+gameid+ "["+ getTime() +"]");

			 	});


			 	// Gets currentplayer from database and sends to the all clients
			 	socket.on('getcurrentplayer', function(data){
			 		let gameid = data.gameid;
			 			Gameutils.getCurrentPlayer(gameid, function(err, gameutil){
							if(err == 100)
							{
								console.log(err);
							}
							else
							{
								console.log(gameid);
								console.log(gameutil+"annen");
							   client.emit('currentplayer', [gameutil]);
							}
						});

			 	});

			 	// Endturn call ends the turn and decides the next player
			 	socket.on('endturn', function(data){
			 		let gameid = data.gameid;
			 		let userid = data.userid;

			 		// Check for name and message
			 		if(0) // deactivated
			 		{
			 			sendStatus('Please enter a name and message');
			 		}
			 		else
			 		{
						var updateOnGame = {userid: userid};
						// Setting the next player
			 			Gameutils.nextTurn(gameid, updateOnGame, {}, function(err, gameutil){
							if(err == 100)
							{
								console.log(err);
							}
							else if (err == 404 || err == 300)
							{
							   client.emit('status', [gameutil]);
							}

							else
							{
									playerwhere = {gameid: gameid, playerid: gameutil.currentplayer};
							// Now for the new turn the currentplayer is determined
							// We need to set his infantry number in this new turn
							//Player.setNewTurnInfantry(gameutil.currentplayer)
							//console.log("bubir game util: ", gameutil.currentplayer);

							// Getting the territories that player has to decide how many infantry can he put in his new turn
							   	Player.getPlayerTerritories(playerwhere, function(err, players){
								if(err)
									{
										console.log(err);
									}
								else
									{
										var occupiedTerritoryNum = 0;
										var newTurnInfantryNum = 0;

										// Getting occupied number of territories of the user
										if(players[0] != undefined)
										{
											occupiedTerritoryNum = players[0].territories.length;
										}

										if (occupiedTerritoryNum <= 9)
										{
											newTurnInfantryNum = 3;
										}
										else
										{
											// New turn infantry number
											newTurnInfantryNum = Math.floor(occupiedTerritoryNum/3 + 1);;
										}

										var updateOnPlayer = {infantry: newTurnInfantryNum};
										var playerwhere = {gameid : gameid, playerid : gameutil.currentplayer};
								// TODO: CONTINENT CONTROL MUST BE ADDED: checkContinentControl(players[0].territories);
										Player.setNewTurnInfantry(playerwhere, updateOnPlayer, {}, function(err, player){
										if(err)
										{
											console.log(err);
										}
										else
										{
											client.emit('currentplayer', [[gameutil]]);
										}
										});

										client.emit('currentplayer', [[gameutil]]);
									}
								});


							}


						});

			 		}

			 	});


		 // Handle input events when there is a new message
			 	socket.on('newmessage', function(data){
			 		let gameid = data.gameid;
			 		let name = data.name;
			 		let message = data.message;

			 			//var msg = ; // Taking parameters from request body
			 			// Adding the message to the database
						Chat.addMessage({gameid: gameid, name: name, message: message}, function(err, msg){
							if(err)
							{
								console.log(err);
								res.send("An Error Occured");
							}
							else
							{
								//console.log(msg);
								client.emit('outputmsg', [data]);
								// Send status object
			 				 }

						});


			 	});


			socket.on('disconnect', function() {
				socketCounter--;
				console.log("cikis",username); 	
				console.log("disc people: ",socketCounter);
			});
			
		});

		function getTime(){
			var date = new Date();
			var currentTime = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
			return currentTime;
		}
	}

	}
