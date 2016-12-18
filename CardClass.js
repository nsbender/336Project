class Card {
  constructor() {
    // Card Ranks
    this.cardRanks = Object.freeze({
      UNDEFINED: 0,
      ACE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
      SIX: 6,
      SEVEN: 7,
      EIGHT: 8,
      NINE: 9,
      TEN: 10,
      JACK: 11,
      QUEEN: 12,
      KING: 13
    });
    this.cardRank = this.cardRanks.UNDEFINED;

    this.cardSuits = Object.freeze({
      UNDEFINED: 0,
      CLUBS: 1,
      DIAMONDS: 2,
      HEARTS: 3,
      SPADES: 4
    });
    this.cardSuit = this.cardSuits.UNDEFINED;
  }

  // Setter for the suit
  setSuit(suit) {
    this.cardSuit = suit;
  }

  // Setter for the rank
  setRank(rank) {
    this.cardRank = rank;
  }

  // Get a short string that has a description of the card
  getShortString() {
    var output = "";

    // Figure out the suit
    switch(this.cardSuit) {
      case this.cardSuits.CLUBS:
        output += "C";
        break;
      case this.cardSuits.DIAMONDS:
        output += "D";
        break;
      case this.cardSuits.HEARTS:
        output += "H";
        break;
      case this.cardSuits.SPADES:
        output += "S";
        break;
      default:
        output = "Undefined Card"
        break;
    }

    // Get the rank of the card
    switch(this.cardRank) {
      case this.cardRanks.ACE:
        output = "A" + output;
        break;
      case this.cardRanks.KING:
        output = "K" + output;
        break;
      case this.cardRanks.QUEEN:
        output = "Q" + output;
        break;
      case this.cardRanks.JACK:
        output = "J" + output;
        break;
      default:
        output = this.cardRank + output;
        break;
    }

    return output;
  }

  // Get a long string description of the card
  getString() {
    var output = "";

    // Figure out the suit
    switch(this.cardSuit) {
      case this.cardSuits.CLUBS:
        output += "Clubs";
        break;
      case this.cardSuits.DIAMONDS:
        output += "Diamonds";
        break;
      case this.cardSuits.HEARTS:
        output += "Hearts";
        break;
      case this.cardSuits.SPADES:
        output += "Spades";
        break;
      default:
        output = "Undefined Card"
        break;
    }

    // Get the rank of the card
    switch(this.cardRank) {
      case this.cardRanks.ACE:
        output = "Ace of " + output;
        break;
      case this.cardRanks.KING:
        output = "King of " + output;
        break;
      case this.cardRanks.QUEEN:
        output = "Queen of " + output;
        break;
      case this.cardRanks.JACK:
        output = "Jack of " + output;
        break;
      default:
        output = this.cardRank + " of " + output;
        break;
    }

    return output;
  }
}
module.exports = Card;

// var cardTest = new Card();
// cardTest.setSuit(cardTest.cardSuits.HEARTS);
// cardTest.setRank(cardTest.cardRanks.ACE);
//
// console.log(cardTest.getShortString());
