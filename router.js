module.exports = function(app,io,db) {

  var express = require('express')
	var router = express.Router();

  app.use('/get_map/public/map/', express.static(__dirname + '/public/map/'));
  app.use('/views/', express.static(__dirname + '/views/'));
  app.use('/views/login/', express.static(__dirname + '/views/login/'));
  app.use('/public/map/', express.static(__dirname + '/public/map/'));
  app.use('/profile/views/', express.static(__dirname + '/views/'));
	//app.use('/', express.static(__dirname + '/public/map/'));
	app.use('/images', express.static(__dirname + '/public/images/'));
	//app.use('/get_map/data/', express.static(__dirname + '/public/map/data/'));
	app.use('/game/', express.static(__dirname + '/public/game/'));

	Territory = require('./public/models/territory');
    Gameutils = require('./public/models/gameutils');

	var lobby;
//	var game;

	// Post Method Create Game
	router.get('/lobby', function(req, res){

     User.findById(req.session.userId)
          .exec(function (error, user) {
              if (error)
              {
                return res.sendFile(__dirname +'/views/login/register.html');
              }
              else
              {
                if (user === null)
                {
                  /*
                  console.log("**********************************"+user.username+"aq ismi");
                  // TODO: WILL BE DELETED TO CHECK USER AUTHENTICATION
                  //var username = 'aloscuk';
                  lobby = require('./lobby')(io, user.username, db);
                  var userid = 1;
                  res.render('lobby', {username: user.username});
                  console.log("You are in the lobby!");
                  */
                  res.redirect('/login');

                //return res.sendFile(__dirname +'/views/login/register.html');
                }
                else//if user already logged in
                {   
                  console.log(user.username);
                  lobby = require('./lobby')(io, user.username, db);
                  var userid = 1;
                  res.render('lobby', {username: user.username});
                  console.log("You are in the lobby!");
                }
              }
            });



 		//res.render('lobby', {userid: userid, username: username, howmany: howmany, maplevel: maplevel, gameid: gameid});
		//res.sendFile(__dirname + '/public/map/');

/*
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error)
        {
          return next(error);
        }
        else
        {
          if (user === null)
          {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          }
          else
          {
			var username = req.body.username;
            return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
          }
        }
      });
*/

	});



  // Post Method Create Game
  router.get('/newgame', function(req, res){
    res.render('creategame');
    //res.sendFile(__dirname + '/public/map/');
  });


var isGameCreated = false;


	// MainPage
	router.get('/gamecreation', function(req, res){
		res.sendFile(__dirname + '/public/newgame.html');
	});


    // MainPage
  router.get('/', function(req, res){
    res.redirect('/login');
  });


  var User = require('./public/models/user');

    //login page
    router.get('/login', function(req, res){
      User.findById(req.session.userId)
      .exec(function (error, user) {
          if (error)
          {
            return res.sendFile(__dirname +'/views/login/login.html');
          }
          else
          {
            if (user === null)
            {
              res.sendFile(__dirname +'/views/login/login.html')
            }
            else//if user already logged in
            {    
              res.redirect('/lobby');
              console.log("You have already logged in");
            }
          }
        });
    });


    //login page
    router.get('/register', function(req, res){
      User.findById(req.session.userId)
      .exec(function (error, user) {
          if (error)
          {
            return res.sendFile(__dirname +'/views/login/register.html');
          }
          else
          {
            if (user === null)
            {
            return res.sendFile(__dirname +'/views/login/register.html');
            }
            else//if user already logged in
            {    
             // lobby = require('./lobby')(io, user.username, db);
              res.redirect('/lobby');
              console.log("You have already logged in");
            }
          }
        });
    });


    router.get('/lobbychat', function (req, res, next) {
    	res.sendFile(__dirname + '/public/mainPage.html');
    });

    //After Login
    router.post('/authenticate', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
      var err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }

    if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {

      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }

      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/lobby');
        }
      });

    } else if (req.body.logemail && req.body.logpassword) {
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        //if email and password don't match
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          //return next(err);
          return res.redirect('/login');
        } else {
          req.session.userId = user._id;
          return res.redirect('/lobby');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  })



    router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error)
        {
          return next(error);
        }
        else
        {
          if (user === null)
          {
              res.redirect('/login');
          }
          else
          {

             res.render('profile',{username: user.username, email: user.email});
          }
        }
      });
    });


    router.get('/profile/:username', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error)
        {
          return next(error);
        }
        else
        {
          if (user === null)
          {
              res.redirect('/login');
          }
          else
          {
            var where = {username: req.params.username}
             User.getUser(where, function(err, email){
               if(err)
               { console.log("Socket error occured."); }
                else
                 {
                  console.log(email);
                      res.render('profile',{username: email[0].username, email: email[0].email});
                   }
               });
          
           
          }
        }
      });
    });


    // GET for logout logout
  router.get('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/login');
        }
      });
    }
  });
	// Get Map
	router.get('/get_map',function(req,res){
		res.sendFile(__dirname + '/public/map/index.html');
	});

		// Get Map
	router.get('/get_map/:userid',function(req,res){
		var userid = req.params.userid;
 		res.render('index', {userid: userid, username: "aloscuk", maplevel: "hard"});
		//res.sendFile(__dirname + '/public/map/index.html');
	});


  
  // Post Method Create Game
  router.post('/creategame', function(req, res){
     User.findById(req.session.userId)
          .exec(function (error, user) {
              if (error)
              {
                return res.sendFile(__dirname +'/views/login/register.html');
              }
              else
              {
                if (user === null)
                {
                  res.redirect('/login');
                }
                else //if user already logged in
                {   
                  var gameid = req.params.gameid; 
                  var username = user.username;
                  var howmany = parseInt(req.body.howmany);
                  var maplevel = req.body.maplevel;
                  var gameid = req.body.gameid;
                  var userid = 0;
                  var game = require('./game')(io,gameid,user.username,howmany,maplevel,db); 
                  res.render('index', {userid: userid, username: user.username, howmany: howmany, maplevel: maplevel, creater:user.username, gameid: gameid});
                }
              }
            });
  });


		// Get Map
	router.get('/get_map/:userid/:level/:howmany/:gameid',function(req,res){
		var userid = req.params.userid;
		var maplevel = req.params.level;
		var howmany = req.params.howmany;
    var gameid =  req.params.gameid;
    console.log(userid);
 		res.render('index', {userid: userid, username: "aloscuk", howmany: howmany, maplevel: maplevel, gameid: gameid});
    //res.sendFile(__dirname + '/public/map/index.html');
	});


    // Get Map
 router.get('/game/:gameid',function(req,res){
 User.findById(req.session.userId)
          .exec(function (error, user) {
              if (error)
              {
                return res.sendFile(__dirname +'/views/login/register.html');
              }
              else
              {
                if (user === null)
                {
                  res.redirect('/login');
                }
                else //if user already logged in
                {   
                  var gameid = req.params.gameid;
                   Gameutils.getGameByID(gameid,function(err,gameutil){
                    if(err)
                      {
                        console.log("annaerror",err)
                      }
                      else {
                          var userid = 1;
                          console.log(gameutil);
                          if(gameutil.length)
                          {

                             // io.of('/'+gameid).emit('joingame', {username: user.username});
                              res.render('index', {userid: userid, username: user.username, howmany: gameutil.howmany, maplevel: gameutil.maplevel, creater:gameutil.creater, gameid: gameid});
                          }
                          else
                            {res.redirect('/lobby');}
                          }
                    });
                }
              }
            });
  });



	// Get Map
	router.get('/get_map2',function(req,res){
		res.sendFile(__dirname + '/public/map/user2.html');
	});


	// Get Book from database by ID
	router.get('/get_territories',function(req, res){
		Territory.getAllTerritories(function(err, book){
			if(err)
			{ res.send("Not found"); }
			else
			{ res.json(book); }
		});
	});


	// Put infantry on territory by called tid
	router.put('/putinfantry/:tid',function(req, res){
		var tid = req.params.tid;
		var updateOnTerritory = {}; // What update do we want?
		Territory.putInfantry(tid, updateOnTerritory, {}, function(err, territory){
			if(err)
			{
				console.log(err);
				res.send("An Error Occured");
			}
			else
			{ res.send(territory); }
		});
	});



    return router;
}
