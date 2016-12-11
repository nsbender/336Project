import React from 'react';
import $ from 'jquery';

import playerHand from './playerHand.js';
import table from './table.js';
import otherPlayers from './otherPlayers.js'

module.exports = React.createClass({
  render: function() {
      return (
        <div>
          <div className="otherPlayers">
            <h1>Other Players</h1>
          </div>
          <div className="table">
            <h1>Table</h1>
          </div>
          <div className="playerHand">
            <h1>Player Hand</h1>
          </div>
        </div>
      );
  }

});
