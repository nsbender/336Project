// Import the card class so we can unthaw the cards here
var Card = require("./CardClass");

class Player {
  constructor(browserID, name, cards, chips) {
    this.browserID = browserID;
    this.name = name;
    this.cards = cards;
    this.chips = chips;
    this.roundStatusTypes = Object.freeze({
      NOT_READY: 0,   // This is for when the round starts
      WAITING: 1,     // This is for when the user needs to reply and either check, raise, or call
      FOLD: 2,        // This is for when the user has chickened out
      VALID: 3,       // This is for when the user's current bet amount matches the current bet amount from the game, and the user is all-bet-up
    });
    this.roundStatus = this.roundStatusTypes.NOT_READY;
    this.roundBetAmount = 0; // This is the amount of money the user has put up this round
  }

  // Unthaw the Card objects from their DB versions
  unthaw() {
    var cards = [];
    this.cards.forEach(function(card) {
      card.__proto__ = Card.prototype;
      cards.push(card);
    });
    this.cards = cards;
  }

  // Add a card to the player's hand
  addCard(card) {
    this.cards.push(card);
  }

  // Get the player's hand
  getHand() {
    return this.cards;
  }

  // Get the player's chips
  getChips() {
    return this.chips
  }

  // This method sends a sanitized version of the game that other players can see
  getSanitized() {
    return({
      "name" : this.name,
      "chips" : this.chips,
      "roundStatus" : this.roundStatus,
      "showCards" : (this.roundStatus == this.roundStatusTypes.FOLD),
      "playerHand" : (this.roundStatus == this.roundStatusTypes.FOLD) ? getHand() : []
    });
  }
}
module.exports = Player;
