import React from 'react';
import $ from 'jquery';

import Card from './Card.js'
import GameLog from './GameLog.js'

module.exports = React.createClass({
  render: function() {
    try {
      var playerCards = this.props.data.privateUserData.cards.map(function(card) {
        return (
          <Card className="largeCardImage" filename={card.Filename} description={card.string}/>
        );
      });
      return (
        <div className="PlayerInfoBox">
          <h1>{this.props.data.privateUserData.name}</h1>
          {playerCards}
          <h2>{this.props.data.privateUserData.chips} Chips</h2>
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
