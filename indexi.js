var express = require('Express');
var app = express();
// var things = require('./things.js');
//both index.js and things.js should be in same directory
// app.use('/things', things);

app.get('/', function(req, res){
res.send('Hello everyone');
});

app.get('/get_user/:id', function(req, res){
res.send('The id you specified is ' + req.params.id);
});


app.listen(3000);