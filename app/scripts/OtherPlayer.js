import React from 'react';
import $ from 'jquery';

import Card from './Card.js'

module.exports = React.createClass({
  render: function() {
    var playerCards = this.props.playerHand.map(function(card) {
      return (
        <Card filename={card.Filename} description={card.string}/>
      );
    });
    return (
      <div className="OtherPlayerNode">
        <h3>{this.props.name}</h3>
        <p>Chips: {this.props.chips}</p>
        {playerCards}
      </div>
    );
  }
});
