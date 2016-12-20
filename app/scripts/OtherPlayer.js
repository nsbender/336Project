import React from 'react';
import $ from 'jquery';

import Card from './Card.js'

module.exports = React.createClass({
  render: function() {
    if (this.props.playerHand.length > 0) {
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

    console.log(this.props);

    var activePlayerCSSClassName = (this.props.playerNumber == this.props.activePlayerNumber) ? " activePlayerNode" : "";

    // Return the HTML that has been generated
    return (
      <div className={"OtherPlayerNode" + activePlayerCSSClassName}>
        <h3>{this.props.name}</h3>
        {playerCards}
        <br/>
        {this.props.chips} chips
      </div>
    );
  }
});
