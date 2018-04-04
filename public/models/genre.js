var mongoose = require('mongoose');

var genreSchema = mongoose.Schema({
	name : {type: String, required : true},
	create_date : {type: Date, default: Date.now}
});

// Now it can be accessed from outside
var Genre = module.exports = mongoose.model('Genre', genreSchema );

// Get Genres
module.exports.getGenres = function(callback, limit){
	Genre.find(callback).limit(limit);
}

// Add a Genre
module.exports.addGenre = function(genre, callback){
	Genre.create(genre,callback);
}

// Update a Genre
module.exports.updateGenre = function(id, genre, options, callback){
	var query = {_id: id};
	var update = { name: genre.name };

	Genre.findOneAndUpdate(query,genre,options,callback);
}


// Delete a Genre
module.exports.deleteGenre = function(genre, callback){
	var query = {_id: id};
	Genre.create(genre,callback);
}
