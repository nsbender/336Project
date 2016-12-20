// Import the card class so we can unthaw the cards here
var Card = require("./CardClass");

class Player {
  constructor(browserID, name, cards, chips) {
    this.browserID = browserID;
    this.playerNumber = null;
    this.name = name;
    this.cards = cards;
    this.chips = chips;
    this.readyToPlay = false;
    this.hasFolded = false;
    // this.roundStatusTypes = Object.freeze({
    //   INVALID: 1,     // This is for when the user has not called, folded, or whatever
    //   FOLD: 2,        // This is for when the user has chickened out
    //   VALID: 3,       // This is for when the user's current bet amount matches the current bet amount from the game, and the user is all-bet-up
    // });
    // this.roundStatus = this.roundStatusTypes.NOT_READY;
    this.hasHadTurnThisRound = false;
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
      "playerNumber" : this.playerNumber,
      "name" : this.name,
      "readyToPlay" : this.readyToPlay,
      "chips" : this.chips,
      "roundStatus" : this.roundStatus,
      "hasHadTurn" : this.hasHadTurnThisRound,
      "hasFolded" : this.hasFolded,
      "playerHand" : this.hasFolded ? this.getHand() : []
      // "playerHand" : this.getHand()
    });
  }


  getArrayOfShortStringCards() {
    var retarr = [];
    this.cards.forEach(function(card) {
      retarr.push(card.getShortString());
    });

    return retarr;
  }


  // hasRoyalFlush(communityCards) {
  //
  //   // Returns true if the player has a royal flush
  //
  //   var cards = this.cards.concat(communityCards);
  //
  //   // Arrays to hold cards from each suit
  //   var spades, hearts, diamonds, clubs = [];
  //
  //   // Split the cards up by rank
  //   for (var i = 0; i < cards.length; i++) {
  //     if (cards[i].cardSuit == cards[i].cardSuits.SPADES) { spades.push(cards.splice(i, 1)); }
  //     if (cards[i].cardSuit == cards[i].cardSuits.HEARTS) { hearts.push(cards.splice(i, 1)); }
  //     if (cards[i].cardSuit == cards[i].cardSuits.DIAMONDS) { diamonds.push(cards.splice(i, 1)); }
  //     if (cards[i].cardSuit == cards[i].cardSuits.CLUBS) { clubs.push(cards.splice(i, 1)); }
  //   }
  //
  //   // A function to check for each rank in each suit
  //   var checkForEachRank = function(cards) {
  //     var king, queen, jack, ace, ten = null;
  //     for (var i = 0; i < cards.length; i++) {
  //       if (cards[i].cardRank == 13) { king = cards.splice(i, 1); }
  //       if (cards[i].cardRank == 12) { queen = cards.splice(i, 1); }
  //       if (cards[i].cardRank == 11) { jack = cards.splice(i, 1); }
  //       if (cards[i].cardRank == 1) { ace = cards.splice(i, 1); }
  //       if (cards[i].cardRank == 10) { ten = cards.splice(i, 1); }
  //     }
  //     if (
  //       king != null &&
  //       queen != null &&
  //       jack != null &&
  //       ace != null &&
  //       ten != null
  //     ) { return true; }
  //     return false;
  //   }
  //
  //   if (checkForEachRank(spades) || checkForEachRank(hearts) || checkForEachRank(diamonds) || checkForEachRank(clubs)) {
  //     return true;  // this is a royal flush
  //   }
  //
  //   return false; // this is not a royal flush
  // }
  //
  //
  // hasStraightFlush(communityCards) {
  //
  //
  //
  //
  // }









}
module.exports = Player;
