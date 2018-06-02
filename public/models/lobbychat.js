var mongoose = require('mongoose');

var lobbychatSchema = mongoose.Schema({
	lobbyname : {type: String, required : true},
	lobbymessage : {type: String, required : true},
   // time: { type: Date, default: Date.now }
});

// Now it can be accessed from outside
var Lobbychat = module.exports = mongoose.model('Lobbychat', lobbychatSchema);

// Get Book by Genre it only gets 1 as limit
module.exports.getLobbyChats = function(gameid, callback){
		Lobbychat.find(callback);
}


// Add a Message
module.exports.addLobbyMessage = function(message, callback){
	Lobbychat.create(message,callback);
}

