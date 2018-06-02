var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
  isonline: {
    type:Boolean,
    default: false,
    required: false
  }
});


//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    console.log("selam");
    user.password = hash;
    next();
  })
});

var User = module.exports = mongoose.model('User', UserSchema );

// Make a User Online
module.exports.setOnline = function(where, updateOnUser, options, callback){
  //updateOnUser = {isonline:true};
  User.findOneAndUpdate(where, updateOnUser, {new: true},callback); // It returns the updated version
}

// Get Book by Genre it only gets 1 as limit
module.exports.getOnlines = function(where, callback){
  User.find(where, callback).select('username -_id');
}


// Get Book by Genre it only gets 1 as limit
module.exports.getUser = function(where, callback){
  User.find(where, callback).select(' -_id').limit(1);
}


module.exports.setOffline = function(where, updateOnUser, options, callback){
  //updateOnUser = {isonline:true};
  User.findOneAndUpdate(where, updateOnUser, {new: true},callback); // It returns the updated version
}