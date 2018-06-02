var mongoose = require ('mongoose');


var playersSchema = mongoose.Schema({
	gameid : {type : Number, required : true},
//	name : {type: String, required : true},
	pid : {type: Number, required : true},
	name: {type: String, required : true},
//  color : {type: color,required : true},
	infantry : {type : Number, default : 0 , required : true},
	territories : {type: [Number], default: [], required : true},
	alliance : {type: [Number], required : true}
});

var Players = module.exports = mongoose.model('Players', playersSchema );

// Creating all the territories into database
module.exports.createPlayers = function(players, callback){
	Players.insertMany(players, callback);
}

module.exports.restrictAll = function(playerwhere,callback, limit)
{
var gameid = playerwhere.gameid;
var query = {gameid: gameid};
var newValue = {$set: {restriction : true}};
User.updateMany(query,newValue,callback);

}

module.exports.whoseTurn = function(playerwhere,callback){
var gameid = playerwhere.gameid;
	var query = {gameid: gameid,restriction: true}
	Players.find(query)
	//Players.find(query,{_id: 0, pid:1, name:0, infantry : 0, __v:0, alliance : 0, restriction: 0});
}

module.exports.counter = function(playerwhere,callback){
	var gameid = playerwhere.gameid;
	var query = {gameid:gameid};
	Players.count(query);
}
module.exports.unRestrict = function(playerwhere, callback){
var pid = playerwhere.playerid;
var gameid = playerwhere.gameid;
var query = {gameid : gameid, pid: pid};
var newValue = {restriction: false};
User.findOneAndUpdate(query, newValue,{new: true},callback);

}
// player database

module.exports.loserPlayer1 = function(playerwhere, players, options, callback){


	Players.getPlayerInfantry(pid, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
			{
				foundInfantry = infantrynum[0].infantry;

			var newInfantry = foundInfantry - 1;
			var gameid = playerwhere.gameid;
			var pid = playerwhere.playerid;
			var query = {gameid : gameid,pid: pid};
			var update = { infantry: increasedInfantry };

			Players.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
			}
	});

}

module.exports.loserPlayer2 = function(playerwhere, territory, options, callback){
	Players.getPlayerInfantry(playerwhere, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
			{
				foundInfantry = infantrynum[0].infantry;

			var newInfantry = foundInfantry - 2;
			var gameid = playerwhere.gameid;
			var pid =  playerwhere.playerid;
			var query = {gameid : gameid,pid: pid};
			var update = { infantry: increasedInfantry };

			Players.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
			}
	});
}


module.exports.decreaseInfantry = function(playerwhere, territory, options, callback){

	// First we find the old infantry number of the user
	var pid = playerwhere.playerid;
	var gameid = playerwhere.gameid;
	var foundInfantry;
	Player.getPlayerInfantry(playerwhere, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
	    {
	    	foundInfantry = infantrynum[0].infantry;
	    	if(foundInfantry > 0){
				var decreasedInfantry = foundInfantry - 1;
				var query = { gameid: gameid, pid: pid };
				var update = { infantry: decreasedInfantry };
				Player.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
			}
			else {
				callback(800, "You do not have any infantry!");
			}
	    }
	});

}


module.exports.setNewTurnInfantry = function(playerwhere, infantry, options, callback){
	var newInfantry = infantry.infantry;
	var pid =  playerwhere.playerid;
	var gameid = playerwhere.gameid;
	var query = {gameid: gameid, pid: pid };
	var update = { infantry: newInfantry };
	Player.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
}

module.exports.getPlayerInfantry = function(playerwhere, callback){
	var gameid = playerwhere.gameid;
	var pid = playerwhere.playerid;
	var query ={gameid: gameid, pid : pid};
	Players.find(query, callback).select('infantry -_id').limit(1);
}

module.exports.getPlayerTerritories = function(playerwhere, callback){
	var gameid = playerwhere.gameid;
	var pid = playerwhere.playerid;
	var query ={gameid: gameid, pid : pid};
	Players.find(query, callback).select('territories -_id').limit(1);
}



// PutInfantry on Territory
module.exports.pushTerritoryToPlayer = function(playerwhere, updateOnPlayer, options, callback){
	var pid = playerwhere.playerid;
	var gameid = playerwhere.gameid;

	var query = {gameid: gameid, pid: pid};
//	db.events.update(query, { $push : { "events" : { "profile" : 10, "data" : "X"}}}, {"upsert" : true});
	Player.findOneAndUpdate(query, updateOnPlayer, {new: true},callback); // It returns the updated version
}
