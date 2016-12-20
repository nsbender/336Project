// Game rules taken from here: https://www.partypoker.com/how-to-play/texas-holdem.html

// Import the player class so we can unthaw players in the game class
var Player = require("./PlayerClass");
// Import the card class so we can add cards to the game
var Card = require("./CardClass");

// Poker hand solver library
var Hand = require('pokersolver').Hand;

class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.startDate = "";
    this.minBet = 1;
    this.roundNumber = 0;
    // this.pot = 0; // Make this a dynamic variable
    // Let's use this enum-like struct to keep track of the state of the game
    this.statusTypes = Object.freeze({
      CREATED: 0,         // This is the state of the game when players are joining and stuff
      READY: 1,           // This is the state of the game after all players have marked it as ready, but before play has started
      HOLE: 2,            // This is when the first two cards are dealt to each player
      HOLE_BETTING: 3,    // This is the round of betting after the first two cards are dealt
      FLOP: 4,            // This is when three cards are shown on the table
      FLOP_BETTING: 5,    // Betting again after the first three cards on the table
      TURN: 6,            // The fourth shared card is dealt onto the table
      TURN_BETTING: 7,    // More betting after the fourth card is put onto the table
      RIVER: 8,           // The fifth shared card is dealt onto the table
      RIVER_BETTING: 9,   // The final round of betting
      HAND_COMPLETE: 10,  // When everyone's bets are in, and the winning hand is calculated
      GAME_OVER: 11
    });
    this.status = this.statusTypes.CREATED;

    // A list to hold all of the players in the game
    this.players = [];

    // Lists to hold the cards in the game
    this.deckCards = [];
    this.communityCards = [];
    this.discardCards = [];

    // Information about the current round of betting
    this.currentRoundBettingAmountPerPlayer = 0; // The amount that each player must bet to stay in the round
    this.activePlayer = -1;

    // A log to store messages by other players, eg. how much they bet etc
    this.messageLog = []; // A list of strings to show a betting history

  }

  // Unthaw the Player objects from their DB versions
  unthawPlayers() {
    var players = [];
    this.players.forEach(function(player) {
      player.__proto__ = Player.prototype;
      player.unthaw();
      players.push(player);
    });
    this.players = players;
  }

  // Unthaw the Card objects from their DB versions
  unthawCards() {
    var cards = [];
    this.cards.forEach(function(card) {
      card.__proto__ = Card.prototype;
      cards.push(card);
    });
    this.cards = cards;
  }

  // This method is for adding a player to the game
  addPlayer(player) {
    this.players.push(player);
  }

  // Get the size of the pot
  getPotSize() {
    var potSize = 0;
    this.players.forEach(function(player) {
      potSize += player.roundBetAmount;
    });
    return potSize;
  }

  checkIfAuthorizedUser(uniquePlayerID) {
    // Check to see if the user is authorized to see the game, or if they need to sign up
    var authorized = false;
    this.players.forEach(function (player) {
      if (player.browserID == uniquePlayerID) { authorized = true; }
    });
    return authorized;
  }

  // This is the method that makes an object that can be sent to the player's browserID
  getGameForSyndication(uniquePlayerID) {

    // Make a var to hold the sanitized players
    var players = [];

    // Make sure we're only sending public info by sanitizing the players
    this.players.forEach(function (player) {
      players.push(player.getSanitized());
    })

    // Get the user-who-requested-the-data's private information
    var userPrivate;
    this.players.forEach(function (player) {
      if (player.browserID == uniquePlayerID) { userPrivate = player; }
    })

    // Actually return stuff
    return({
      "roomName" : this.roomName,
      "players" : players,
      "numberofDeckCards" : this.deckCards.length,
      "numberOfDiscardCards" : this.discardCards.length,
      "communityCards" : this.communityCards,
      "potValue" : this.getPotSize(),
      "roundNumber" : this.roundNumber,
      "gameState" : this.status,
      "currentRoundBettingAmountPerPlayer" : this.currentRoundBettingAmountPerPlayer,
      "activePlayer" : this.activePlayer,
      "currentRoundMustBetToStayIn" : (this.currentRoundBettingAmountPerPlayer - userPrivate.roundBetAmount),
      "privateUserData" : userPrivate,
      "messageLog" : this.messageLog
    });
  }

  bettingLogic(advanceLocation) {
    var readyToAdvance = true;
    var numberOfNonFoldedPlayers = 0;

    // Check if all the betting has been completed
    for (var i = 0; i < this.players.length; i++) {
      if ((this.players[i].roundBetAmount != this.currentRoundBettingAmountPerPlayer) && !this.players[i].hasFolded) { readyToAdvance = false; }
      if (!this.players[i].hasHadTurnThisRound) { readyToAdvance = false; }
      if (!this.players[i].hasFolded) { numberOfNonFoldedPlayers += 1; }
    }

    // Check to see if everyone has folded
    if (numberOfNonFoldedPlayers == 1) {
      this.status = this.statusTypes.HAND_COMPLETE;
    }

    if (readyToAdvance) {
      this.status = advanceLocation;
      // statusChanged = true;
    }
    else {
      // Find out who's turn it is (first person in the array who has not gone yet)
      for (var i = 0; i < this.players.length; i++) {
        // console.log("stuff");
        if (!this.players[i].hasHadTurnThisRound && !this.players[i].hasFolded) {
          this.activePlayer = this.players[i].playerNumber;
          // It's this person's time to go, so indicate that in the JSON
          break;  // out of this loop
        }
      }
    }
  }

  gameLogic() {

    // Trim the message log
    while(this.messageLog.length > 10) {
      this.messageLog.shift();
    }

    var statusChanged = false;

    switch (this.status) {

      case this.statusTypes.CREATED:
        var readyToStart = true;
        this.players.forEach(function(player) {
          if (!player.readyToPlay) { readyToStart = false; }
        });
        if (readyToStart) {
          this.status = this.statusTypes.READY;
          statusChanged = true;
        }
        break;

      case this.statusTypes.READY:
        // Assign each player a public player number greater than 0 (used for when all players must respond)
        for (var i = 0; i < this.players.length; i++) {
          this.players[i].playerNumber = i+1;
        }
        this.status = this.statusTypes.HOLE;
        break;

      case this.statusTypes.HOLE:
        // Init the game.  Give everyone cards etc

        // Set each player's betting vars to the defaults
        for (var i = 0; i < this.players.length; i++) {
          this.players[i].hasHadTurnThisRound = false;
          this.players[i].hasFolded = false;
          this.players[i].roundBetAmount = 0;
          this.players[i].cards = [];
        }

        // Reset the current round game vars
        this.currentRoundBettingAmountPerPlayer = 0;
        this.deckCards = [];
        this.communityCards = [];

        // Init the deck
        for (var rank = 1; rank <= 13; rank++) {
          // For each rank, add a card per suit
          for (var suit = 1; suit <= 4; suit++) {
            var card = new Card();
            card.setRank(rank);
            card.setSuit(suit);
            card.string = card.getString();
            card.shortString = card.getShortString();
            card.Filename = card.getFilename();
            // console.log(card.getString());
            this.deckCards.push(card);
          }
        }

        // Deal two cards to each player
        for (var i = 0; i < this.players.length; i++) {
          for (var j =0; j < 2; j++) {
            // Get a ranom card from the deck put it into the player's hand
            var card = this.deckCards[Math.floor(Math.random() * this.deckCards.length)];
            this.deckCards.splice(this.deckCards.indexOf(card), 1);  // Remove from the deck
            this.players[i].addCard(card);  // Add to the player's hand
          }
        }


        // TODO: Ante-up if we add that feature?

        this.status = this.statusTypes.HOLE_BETTING;
        statusChanged = true;
        break;

      case this.statusTypes.HOLE_BETTING:

        this.bettingLogic(this.statusTypes.FLOP);

        break;

      case this.statusTypes.FLOP:

        // Put down the first three cards for the flop
        for (var j =0; j < 3; j++) {
          // Get a ranom card from the deck and put it into the community pile hand
          var card = this.deckCards[Math.floor(Math.random() * this.deckCards.length)];
          this.deckCards.splice(this.deckCards.indexOf(card), 1);  // Remove from the deck
          this.communityCards.push(card);  // Add to the community pile
        }

        // Set each player to indicate that they have not had a turn this round yet
        for (var i = 0; i < this.players.length; i++) {
          this.players[i].hasHadTurnThisRound = false;
        }

        this.status = this.statusTypes.FLOP_BETTING;
        statusChanged = true;
        break;

      case this.statusTypes.FLOP_BETTING:

        this.bettingLogic(this.statusTypes.TURN);

        break;

      case this.statusTypes.TURN:

        // Put down the fourth card into the community pile
        // Get a ranom card from the deck and put it into the community pile hand
        var card = this.deckCards[Math.floor(Math.random() * this.deckCards.length)];
        this.deckCards.splice(this.deckCards.indexOf(card), 1);  // Remove from the deck
        this.communityCards.push(card);  // Add to the community pile

        // Set each player to indicate that they have not had a turn this round yet
        for (var i = 0; i < this.players.length; i++) {
          this.players[i].hasHadTurnThisRound = false;
        }

        this.status = this.statusTypes.TURN_BETTING;
        statusChanged = true;
        break;

      case this.statusTypes.TURN_BETTING:

        this.bettingLogic(this.statusTypes.RIVER);

        break;

      case this.statusTypes.RIVER:

        // Put down the fifth card into the community pile
        // Get a ranom card from the deck and put it into the community pile hand
        var card = this.deckCards[Math.floor(Math.random() * this.deckCards.length)];
        this.deckCards.splice(this.deckCards.indexOf(card), 1);  // Remove from the deck
        this.communityCards.push(card);  // Add to the community pile

        // Set each player to indicate that they have not had a turn this round yet
        for (var i = 0; i < this.players.length; i++) {
          this.players[i].hasHadTurnThisRound = false;
        }

        this.status = this.statusTypes.RIVER_BETTING;
        statusChanged = true;
        break;

      case this.statusTypes.RIVER_BETTING:

        this.bettingLogic(this.statusTypes.HAND_COMPLETE);

        break;

      case this.statusTypes.HAND_COMPLETE:

        // Check to see if someone won by folding
        var numberOfNonFoldedPlayers = 0;

        // Check if any players have folded
        for (var i = 0; i < this.players.length; i++) {
          if (!this.players[i].hasFolded) { numberOfNonFoldedPlayers += 1; }
        }

        // Check to see if everyone has folded
        if (numberOfNonFoldedPlayers == 1) {
          // The non-folding player won by default
          // Find which player has the winning hand
          for (var i = 0; i < this.players.length; i++) {
            if (!this.players[i].hasFolded) {
              //console.log(this.players[i].name);
              winningPlayerNumber = this.players[i].playerNumber;

              // Give that player all the cash from the Jackpot
              this.players[i].chips += this.getPotSize();

              // Push a message to the server
              this.messageLog.push(this.players[i].name + " won that round because everyone else folded!");
            }
          }
        }
        else {
          // Create a Hand object for each player, based on their cards
          var playerHands = [];

          // Add each player's hand
          for (var i = 0; i < this.players.length; i++) {

            var hand = Hand.solve(this.players[i].getArrayOfShortStringCards());
            // console.log(hand);
            this.players[i].handSolverObject = hand;
            playerHands.push(hand);

          }

          // Calculate the winning hand
          var winner = Hand.winners(playerHands);
          var winningPlayerNumber = -1;

          // console.log(winner);

          // Find which player has the winning hand
          for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].handSolverObject == winner[0]) {
              console.log(this.players[i].name);
              winningPlayerNumber = this.players[i].playerNumber;

              // Give that player all the cash from the Jackpot
              this.players[i].chips += this.getPotSize();

              this.messageLog.push(this.players[i].name + " won that round with a " + winner[0].descr + "!");
            }
          }
        }


        this.status = this.statusTypes.HOLE;
        statusChanged = true;

        break;

      case this.statusTypes.GAME_OVER:

        this.message = "This game is over."

        break;

      default:
        // Uh, crap
        break;

    }

    // CREATED: 0,         // This is the state of the game when players are joining and stuff
    // READY: 1,           // This is the state of the game after all players have marked it as ready, but before play has started
    // HOLE: 2,            // This is when the first two cards are dealt to each player
    // HOLE_BETTING: 3,    // This is the round of betting after the first two cards are dealt
    // FLOP: 4,            // This is when three cards are shown on the table
    // FLOP_BETTING: 5,    // Betting again after the first three cards on the table
    // TURN: 6,            // The fourth shared card is dealt onto the table
    // TURN_BETTING: 7,    // More betting after the fourth card is put onto the table
    // RIVER: 8,           // The fifth shared card is dealt onto the table
    // RIVER_BETTING: 9,   // The final round of betting
    // HAND_COMPLETE: 10,  // When everyone's bets are in, and the winning hand is calculated
    // GAME_OVER: 11
  }
}
module.exports = Game;
