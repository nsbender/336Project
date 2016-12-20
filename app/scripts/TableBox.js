import React from 'react';
import $ from 'jquery';

import Card from './Card.js'


module.exports = React.createClass({

  render: function() {
    try {
      var communityCards = this.props.data.communityCards.map(function(card) {
        return (
          <Card className="largeCardImage" filename={card.Filename} description={card.string}/>
        );
      });

      // Determine the game state and print an instructional message
      switch (this.props.data.gameState) {
        case 0:
          var gameStateText = "New game"
          var gameStateDescription = "Waiting for all players to indicate they are ready"
          break;

        case 3:
          var gameStateText = "The Hole"
          var gameStateDescription = "Two cards have been dealt to each player... commence the betting!"
          break;

        case 5:
          var gameStateText = "The Flop"
          var gameStateDescription = "The first three community cards have been laid on the table, now bet!"
          break;

        case 7:
          var gameStateText = "The Turn"
          var gameStateDescription = "A fourth card has been added to the community table."
          break;

        case 9:
          var gameStateText = "The River"
          var gameStateDescription = "Ok, we aren't going to be laying any more cards out here, so get your bets in now!"
          break;

        default:
          var gameStateText = "Awesome Poker Game"
          var gameStateDescription = "The game is thinking...";
          break;
      }

      return (
        <div className="TableBox">
          {communityCards}
          <h1>Jackpot: {this.props.data.potValue}</h1>
          <div className="gameStateExplanation">
            <h3>{gameStateText}</h3>
            <p>{gameStateDescription}</p>
          </div>
        </div>
      );
    }
    catch (e) {
      console.log("Couldn't render the TableBox class");
      console.log(e);
      return(<div>Loading...</div>);
    }
  }


});
