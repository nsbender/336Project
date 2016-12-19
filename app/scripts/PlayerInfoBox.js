import React from 'react';
import $ from 'jquery';

import Card from './Card.js'

module.exports = React.createClass({
  render: function() {
    try {
      var playerCards = this.props.data.privateUserData.cards.map(function(card) {
        return (
          //<Card filename={card.Filename} description={card.string}/>
          <Card className="largeCardImage" filename={card.Filename} description={card.string}/>
        );
      });
      return (
        <div className="PlayerInfoBox">
        <h1>You</h1>
        <h2>{this.props.data.privateUserData.chips} Chips</h2>
        {playerCards}
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
