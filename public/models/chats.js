var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
	name : {type: String, required : true},
	message : {type: String, required : true}
});

// Now it can be accessed from outside
var Chat = module.exports = mongoose.model('Chat', chatSchema );

// Get Chats
module.exports.getChats = function(callback, limit){
	Chat.find(callback).limit(limit);
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