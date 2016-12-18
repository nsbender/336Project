// CS336 Calvin Poker Club Site
// by Nate Bender (nsb2) and Christiaan Hazlett (cdh24)
// Fall 2016

// Include the stuff we need
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
// var cookie = require('cookie');
var cookieParser = require('cookie-parser')
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
app.use(cookieParser());
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
          // Unthaw the Game class
          result.__proto__ = Game.prototype;

          // Unthaw all the players in the game class
          result.unthawPlayers();  // TODO: implement a single .unthaw() that does players and cards

          // Run the game logic to see if the game is ready to proceed
          result.gameLogic();

          // Send data if the user is authorized, otherwise send error message
          if (result.checkIfAuthorizedUser(req.cookies.uniquePlayerID)) {
            res.json(result.getGameForSyndication(req.cookies.uniquePlayerID));
          }
          else {
            res.json({"error" : "User is not authorized"});
          }
        }
    });
});

// This is for folding during a round
app.get('/api/game/:roomName/fold', function(req, res) {
  db.collection("games").findOne({"roomName" : req.params.roomName}, function(err, result) {
      if (err) throw err;
      if (result == null) { res.json({"error" : "Could not find this game."}) }
      else {
        // Unthaw the Game class
        result.__proto__ = Game.prototype;

        // Unthaw all the players in the game class
        result.unthawPlayers();  // TODO: implement a single .unthaw() that does players and cards

        // // Run the game logic to see if the game is ready to proceed
        // result.gameLogic();

        // Check to see if the player is authorized using the browser cookie
        if (result.checkIfAuthorizedUser(req.cookies.uniquePlayerID)) {
          // Loop through to find the player, and set them to having folded
          result.players.forEach(function(player) {
            if (player.browserID == req.cookies.uniquePlayerID) { player.hasFolded = true; }
          });
          db.collection("games").update({"roomName" : req.params.roomName}, result);  // Push the game back to the db
          res.json({"message" : "User folded"});
        }
        else {
          res.json({"error" : "User is not authorized"});
        }
      }
  });
});

// This route is for checking during a round
app.get('/api/game/:roomName/check', function(req, res) {
  db.collection("games").findOne({"roomName" : req.params.roomName}, function(err, result) {
      if (err) throw err;
      if (result == null) { res.json({"error" : "Could not find this game."}) }
      else {
        // Unthaw the Game class
        result.__proto__ = Game.prototype;

        // Unthaw all the players in the game class
        result.unthawPlayers();  // TODO: implement a single .unthaw() that does players and cards

        // // Run the game logic to see if the game is ready to proceed
        // result.gameLogic();

        // Check to see if the player is authorized using the browser cookie
        if (result.checkIfAuthorizedUser(req.cookies.uniquePlayerID)) {
          // Loop through to find the player, and set them to having checked
          // if they are allowed to do that
          result.players.forEach(function(player) {
            if (player.browserID == req.cookies.uniquePlayerID &&
                (player.roundBetAmount == result.currentRoundBettingAmountPerPlayer))
                {
                  player.hasHadTurnThisRound = true;
                }
          });
          db.collection("games").update({"roomName" : req.params.roomName}, result);  // Push the game back to the db
          res.json({"message" : "User checked"});
        }
        else {
          res.json({"error" : "User is not authorized"});
        }
      }
  });
});

// This route is for calling during a round
app.get('/api/game/:roomName/call', function(req, res) {
  db.collection("games").findOne({"roomName" : req.params.roomName}, function(err, result) {
      if (err) throw err;
      if (result == null) { res.json({"error" : "Could not find this game."}) }
      else {
        // Unthaw the Game class
        result.__proto__ = Game.prototype;

        // Unthaw all the players in the game class
        result.unthawPlayers();  // TODO: implement a single .unthaw() that does players and cards

        // // Run the game logic to see if the game is ready to proceed
        // result.gameLogic();

        // Check to see if the player is authorized using the browser cookie
        if (result.checkIfAuthorizedUser(req.cookies.uniquePlayerID)) {
          // Loop through to find the player, and set them to having checked
          // if they are allowed to do that
          result.players.forEach(function(player) {
            if (player.browserID == req.cookies.uniquePlayerID)
                {
                  var deltaBet = result.currentRoundBettingAmountPerPlayer - player.roundBetAmount;
                  if (deltaBet <= player.chips) {
                    player.hasHadTurnThisRound = true;
                    player.roundBetAmount += deltaBet;
                    player.chips -= deltaBet
                  }
                }
          });
          db.collection("games").update({"roomName" : req.params.roomName}, result);  // Push the game back to the db
          res.json({"message" : "User called"});
        }
        else {
          res.json({"error" : "User is not authorized"});
        }
      }
  });
});

// // This route is for raising the bet during a round
// app.get('/api/game/:roomName/raise', function(req, res) {
//   db.collection("games").findOne({"roomName" : req.params.roomName}, function(err, result) {
//       if (err) throw err;
//       if (result == null) { res.json({"error" : "Could not find this game."}) }
//       else {
//         // Unthaw the Game class
//         result.__proto__ = Game.prototype;
//
//         // Unthaw all the players in the game class
//         result.unthawPlayers();  // TODO: implement a single .unthaw() that does players and cards
//
//         // // Run the game logic to see if the game is ready to proceed
//         // result.gameLogic();
//
//         // Check to see if the player is authorized using the browser cookie
//         if (result.checkIfAuthorizedUser(req.cookies.uniquePlayerID)) {
//           // Loop through to find the player, and set them to having checked
//           // if they are allowed to do that
//           result.players.forEach(function(player) {
//             if (player.browserID == req.cookies.uniquePlayerID)
//                 {
//                   var deltaBet = result.currentRoundBettingAmountPerPlayer - player.roundBetAmount;
//                   if (deltaBet <= player.chips) {
//                     player.hasHadTurnThisRound = true;
//                     player.roundBetAmount += deltaBet;
//                     player.chips -= deltaBet
//                   }
//                 }
//           });
//           db.collection("games").update({"roomName" : req.params.roomName}, result);  // Push the game back to the db
//           res.json({"message" : "User called"});
//         }
//         else {
//           res.json({"error" : "User is not authorized"});
//         }
//       }
//   });
// });







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







// _______        _   _               _____             _
//|__   __|      | | (_)             |  __ \           | |
//   | | ___  ___| |_ _ _ __   __ _  | |__) |___  _   _| |_ ___  ___
//   | |/ _ \/ __| __| | '_ \ / _` | |  _  // _ \| | | | __/ _ \/ __|
//   | |  __/\__ \ |_| | | | | (_| | | | \ \ (_) | |_| | ||  __/\__ \
//   |_|\___||___/\__|_|_| |_|\__, | |_|  \_\___/ \__,_|\__\___||___/
//                             __/ |
//                            |___/

// set cookie route for testing
app.get('/api/setcookie/:browserid', function(req, res) {
  res.cookie("uniquePlayerID", req.params.browserid);  // TODO: figure out how to make this last longer than the session
  res.send("cookie set");
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
