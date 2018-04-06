var mongoose = require('mongoose');

// Territory has a territoryid, territoryname, number of soldier, neighbors, who owns to this territory
var territorySchema = mongoose.Schema({
	tid : {type: Number, required : true},
	tname : {type: String, required : true},
	infantry : {type: Number, default: 0, required : true},
	neighbors : {type: [Number], required : true}, // [[Number]] Array of numbers (ints: neighbors)
	ownsto: {type: Number, default: -1, required:true}
});

// Now it can be accessed from outside
var Territory = module.exports = mongoose.model('Territory', territorySchema );

// Get Territories
module.exports.getTerritories = function(callback, limit){
	Territory.find(callback).limit(limit);
}

// Add a Message
module.exports.addTerritory = function(message, callback){
	Territory.create(message,callback);
}
