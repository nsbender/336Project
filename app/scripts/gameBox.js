import React from 'react';
import $ from 'jquery';

import playerHand from './playerHand.js';
import table from './table.js';
import otherPlayers from './otherPlayers.js'

module.exports = React.createClass({

  render: function() {
      return (
        <div>
        <h1>Welcome To PokerStars.net</h1>
        <h2>Create a new game, or enter the id of an already existing game in the field below</h2>
        </div>
      );
  }

});
