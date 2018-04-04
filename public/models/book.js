var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	title : {type: String, required : true},
	genre : {type: String, required : true},
	description: {type: String, required : true},
	author: {type: String, required : true},
	publisher: {type: String},
	pages: {type: String},
	image_url: {type: String},
	buy_url: {type: String},
	create_date : {type: Date, default: Date.now}
});

// Now it can be accessed from outside
var Book = module.exports = mongoose.model('Book', bookSchema);

// Get Books
module.exports.getBooks = function(callback, limit){
	Book.find(callback).limit(limit);
}

// Get Book by ID
module.exports.getBookById = function(id, callback){
	Book.findById(id, callback);
}

// Get Book by Genre it only gets 1 as limit
module.exports.getBookByGenre = function(genre, callback){
	Book.find({ 'genre': genre }, callback).limit(1);
}