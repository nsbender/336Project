import React from 'react';
import $ from 'jquery';

import Card from './Card.js'

module.exports = React.createClass({
  render: function() {
    if (this.props.playerHand.length > 10) {
      // Show the hand of the player
      var playerCards = this.props.playerHand.map(function(card) {
        return (
          <Card filename={card.Filename} description={card.string}/>
        );
      });
    }
    else {
      // Show two face-down cards
      var playerCards = ["card1", "card2"].map(function(card) {
        return (
          <Card filename="face_down.png" description="Face down playing card"/>
        );
      });
    }

    return (
      <div className="OtherPlayerNode">
        <h3>{this.props.name}</h3>
        {playerCards}
        <br/>
        Chips: {this.props.chips}
      </div>
    );
  }
});
