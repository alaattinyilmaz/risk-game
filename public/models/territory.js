var mongoose = require('mongoose');

// Territory has a territoryid, territoryname, number of soldier, neighbors, who owns to this territory
var territorySchema = mongoose.Schema({
	gameid : {type: Number,default:-1, required : true},
	tid : {type: Number, required : true},
	continent : {type: Number, required : true},
	tname : {type: String, required : true},
	infantry : {type: Number, default: 0, required : true},
	neighbors : {type: [Number], required : true}, // [[Number]] Array of numbers (ints: neighbors)
	ownsto: {type: Number, default: -1, required:true}
});

// Now it can be accessed from outside
var Territory = module.exports = mongoose.model('Territory', territorySchema );

// Creating all the territories into database
module.exports.createTerritories = function(territories, callback){
	Territory.insertMany(territories, callback);
}

// Get Territories
module.exports.getAllTerritories = function(where, callback){

	Territory.find({ 'gameid': where }, callback);
}


// Get Territory by ID
module.exports.getBookById = function(where, callback){
	var tid = where.tid;
	var gameid = where.gameid;
	var query = {tid: tid, gameid: gameid};
	Territory.findById(query, callback);//TODO
}

// Add a Message
module.exports.addTerritory = function(message, callback){
	Territory.create(message,callback);
}

// PutInfantry on Territory
module.exports.putInfantry = function(where, territory, options, callback){

	// First we find the old infantry number of the territory
	var foundInfantry;
	var tid = where.tid;
	var gameid = where.gameid;

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
			var query = {gameid:gameid, tid: tid};
			var update = { infantry: increasedInfantry };

			Territory.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
	    }
	});

}

// PutInfantry on Territory
module.exports.setTerritoryInfantry = function(where, updateOnTerritory, options, callback){
	var tid = where.tid;
	var gameid = where.gameid;
	var query = {gameid: gameid, tid: tid};
	Territory.findOneAndUpdate(query, updateOnTerritory, {new: true},callback); // It returns the updated version
}

// PutInfantry on Territory
module.exports.territoryDeployment = function(where, territory, options, callback){

	var increasedInfantry = foundInfantry + 1;
	var tid = where.tid;
	var gameid = where.gameid;
	var query = {gameid: gameid, tid: tid};
	var update = { infantry: increasedInfantry };
	Territory.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
}

// Get Book by Genre it only gets 1 as limit
module.exports.getTerritoryInfantry = function(where, callback){
	var tid = where.tid;
	var gameid = where.gameid;
	var query ={gameid: gameid, tid: tid};
	Territory.find(query, callback).select('infantry -_id').limit(1);
}

// Get Book by Genre it only gets 1 as limit
module.exports.getTerritoriesByID = function(where, callback){
	var tid = where.tid;
	var gameid = where.gameid;
	var query = {gameid: gameid, tid: tid};
	Territory.find(query, callback).limit(1);
}
