// Game rules taken from here: https://www.partypoker.com/how-to-play/texas-holdem.html

// Import the player class so we can unthaw players in the game class
var Player = require("./PlayerClass");

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
    this.betHistory = []; // A list of strings to show a betting history

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

  // This is the method that makes an object that can be sent to the player's browserID
  getGameForSyndication() {

    // Make a var to hold the sanitized players
    var players = [];

    // Make sure we're only sending public info by sanitizing the players
    this.players.forEach(function (player) {
      players.push(player.getSanitized());
    })

    // Actually return stuff
    return({
      "players" : players,
      "deckCards" : this.deckCards.length,
      "numberOfDiscardCards" : this.discardCards.length,
      "communityCards" : this.communityCards,
      "potValue" : this.getPotSize(),
      "roundNumber" : this.roundNumber
    });
  }
}
module.exports = Game;
