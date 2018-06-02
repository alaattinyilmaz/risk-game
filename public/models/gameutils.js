var mongoose = require('mongoose');

// Territory has a territoryid, territoryname, number of soldier, neighbors, who owns to this territory
var gameutilsSchema = mongoose.Schema({
	gameid : {type: Number, default : -1,required : true},
	currentphase : {type: Number, default: -1, required : true}, // -1 for firstturn
	currentplayer : {type: Number, default: -1, required : true}, // Who is the currentplayerid-> USER ID
	players : {type: [Number], required : true}, // Who are playing in this game
	gamefinish : {type: Boolean, default: false, required : true},
	playernames : {type: [String], required : true}, // Who are playing in this game
	howmany : {type: Number, default: 3, required : true}, // -1 for firstturn
	maplevel : {type: String, required : true}, // Who are playing in this game
	creater : {type: String, required : true} // Who created the game
	//ownsto: {type: Number, default: -1, required:true}
});

// Now it can be accessed from outside
var Gameutils = module.exports = mongoose.model('Gameutils', gameutilsSchema );

// Get Territories
module.exports.getAllTerritories = function(callback, limit){
	Gameutils.find(callback).limit(limit);
}
/*
module.exports.getTerritoryCount = function(gameid, callback){
	var query = {gameid: gameid};
	Gameutils.count();
}
*/
// Get Game by ID
module.exports.getBookById = function(id, callback){
	GameUtils.findById(id, callback);
}

// Add a Message
module.exports.addGameUtil = function(gameutil, callback){
	Gameutils.create(gameutil,callback);
}

// Update a Genre
module.exports.putInfantry = function(where, territory, options, callback){

	// First we find the old infantry number of the territory
  var gameid = where.gameid;
	var tid = where.tid;
	var foundInfantry;

	Territory.getTerritoryInfantry(where, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
	    {
	    	// console.log("num", infantrynum[0].infantry);
	    	foundInfantry = infantrynum[0].infantry;

			var increasedInfantry = foundInfantry + 1;
			var query = {gameid: gameid, tid: tid};
			var update = { infantry: increasedInfantry };

			Territory.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
	    }
	});
}



// Update a Genre
module.exports.nextTurn = function(gameid, gameutil, options, callback){

	var userid = gameutil.userid;
	// First we find the old infantry number of the territory
	var previousPlayer;

	Gameutils.getCurrentPlayer(gameid, function(err, prevplayer){
		if(err)
		{
			console.log("error: ", err);
		}
		else
	    {
	    	if(prevplayer.length){
	    	// If it is really the previous player
	    	var previousPlayer = prevplayer[0].currentplayer;

		    	if(userid == previousPlayer){
					var currentPlayer = previousPlayer + 1;
					if(previousPlayer == prevplayer[0].players.length-1){
						currentPlayer = 0;
					}

					var query = {gameid: gameid};
					var update = { currentplayer: currentPlayer };
					Gameutils.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
				}
				else
				{
					callback(300, "It is not your turn!");
				}
			}
			else {
				callback(404, "There is not a such game.");
			}
	    }
	});
}


// Update a Genre
module.exports.checkCurrentPlayer = function(gameid, gameutil, options, callback){

	var userid = gameutil.userid;
	// First we find the old infantry number of the territory
	var previousPlayer;

	Gameutils.getCurrentPlayer(gameid, function(err, prevplayer){
		if(err)
		{
			console.log("error: ", err);
		}
		else
	    {

	    	if(prevplayer.length){
	    	// If it is really the previous player
	    	var previousPlayer = prevplayer[0].currentplayer;

		    	if(userid == previousPlayer){
		    		callback(0, true)
				}
				else
				{
					callback(0, false);
				}
			}
			else {
				callback(404, "There is not a such game");
			}
	    }
	});
}



// Increase infantry number of a territory
module.exports.putInfantry = function(where, territory, options, callback){

	// First we find the old infantry number of the territory
 var tid = where.tid;
 var gameid = where.gameid;
	var foundInfantry;

	Territory.getTerritoryInfantry(where, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
	    {
	    	foundInfantry = infantrynum[0].infantry;

			var increasedInfantry = foundInfantry + 1;
			var query = {tid: tid, gameid:gameid};
			var update = { infantry: increasedInfantry };

			Territory.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
	    }
	});
}


// Get Book by Genre it only gets 1 as limit
module.exports.getCurrentPlayer = function(gameid, callback){
	Gameutils.find({ 'gameid': gameid }, callback).select('currentplayer players -_id').limit(1);
}

module.exports.getCurrentGameid = function(gameid, callback){
	Gameutils.find({ 'gameid': gameid }, callback).select('gameid -_id').limit(1);
}


// Get Book by Genre it only gets 1 as limit
module.exports.getTerritoriesByID = function(where, callback){
	var tid =where.tid;
	var gameid = where.gameid;
	var query = {tid: tid, gameid:gameid}
	Territory.find(query, callback).limit(1);
}

// Get Book by Genre it only gets 1 as limit
module.exports.getOnlineGames = function(whichgames, callback){
	Gameutils.find(whichgames, callback).select(' -_id');
}

// Get Book by Genre it only gets 1 as limit
module.exports.getGameByID = function(gameid, callback){
	Gameutils.find({ 'gameid': gameid }, callback).select(' -_id').limit(1);
}
