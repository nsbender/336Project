// CS336 Calvin Poker Club Site
// by Nate Bender (nsb2) and Christiaan Hazlett (cdh24)
// Fall 2016

// Include the stuff we need
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var favicon = require('serve-favicon');
var MongoClient = require('mongodb').MongoClient

// Import our own classes for the game
var Game = require("./GameClass");
var Player = require("./PlayerClass");
var Card = require("./CardClass");

// Some config stuff, and create the database variable
var db;
var APP_PATH = path.join(__dirname, 'dist');

// Set the port for the server
app.set('port', (process.env.PORT || 3000));

// Init the middleware
app.use('/', express.static(APP_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname,'app','images','favicon.ico')));

// Some HTTP stuff
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


//
// Routes
//


// Get game info needed to draw the main UI page
app.get('/api/game/:roomName', function(req, res) {
    // res.send(req.params.id);
    db.collection("games").findOne({"roomName" : req.params.roomName}, function(err, result) {
        if (err) throw err;
        if (result == null) { res.json({"error" : "Could not find this game."}) }
        else {
          result.__proto__ = Game.prototype;
          result.unthawPlayers();
          res.json(result.getGameForSyndication());
        }
    });
});













// This is for getting a list of all game objects from the db
app.get('/api/games', function(req, res) {
    db.collection("games").find({}).toArray(function(err, docs) {
        if (err) throw err;

        // Iterate through each game object and convert it back into a Game type
        docs.forEach(function (item) {
          item.__proto__ = Game.prototype;  // Replace item prototype with Game prototype
          res.json(item.getGameForSyndication());
        })
    });
});

// This is for making a new game
app.post('/api/games', function(req, res) {
    // Make the new game object
    var newGame = new Game(req.body.roomName);
    newGame.addPlayer(new Player("123", "Mike", [], 10000));

    // Insert the game into the db
    db.collection("games").insertOne(newGame, function(err, result) {
        if (err) throw err;
        res.json({
            "gameID" : newGame._id,
            "roomName" : newGame.roomName // TODO: add check to make sure this is unique, which it probably won't be
          });
    });
});




app.delete('/api/games/:id', function(req, res) {
    db.collection("games").deleteOne(
        {'id': Number(req.params.id)},
        function(err, result) {
            if (err) throw err;
            db.collection("games").find({}).toArray(function(err, docs) {
                if (err) throw err;
                res.json(docs);
            });
        });
});

// Send all routes/methods not specified above to the app root.
app.use('*', express.static(APP_PATH));

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

// This assumes that the MongoDB password has been set as an environment variable.
var mongoURL = 'mongodb://cs336:bjarne@ds159737.mlab.com:59737/336-final-proj';
MongoClient.connect(mongoURL, function(err, dbConnection) {
    if (err) throw err;
    db = dbConnection;
});
