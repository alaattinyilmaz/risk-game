var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
	gameid : {type: Number, required : true},
	name : {type: String, required : true},
	message : {type: String, required : true},
   // time: { type: Date, default: Date.now }
});

// Now it can be accessed from outside
var Chat = module.exports = mongoose.model('Chat', chatSchema );

/*
// Get Chats
module.exports.getChats = function(gameid, callback){
	Chat.find({ 'gameid': gameid }, callback);
}
*/

// Get Book by Genre it only gets 1 as limit
module.exports.getChats = function(gameid, callback){
	Chat.find({ 'gameid': gameid }, callback);
}
// Get Chats
module.exports.getAllChats = function(callback, limit){
	Chat.find(callback);
}

// Add a Message
module.exports.addMessage = function(message, callback){
	Chat.create(message,callback);
}

/*

// Delete a Genre
module.exports.deleteGenre = function(genre, callback){
	var query = {_id: id};
	Genre.create(genre,callback);
}
*/