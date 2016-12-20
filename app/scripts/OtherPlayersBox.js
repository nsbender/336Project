import React from 'react';
import $ from 'jquery';

import OtherPlayer from './OtherPlayer.js'


module.exports = React.createClass({
  // Render the bar across the top of the screen that shows stats of the other
  // players in the game
  render: function() {
    // Try to render with the data from the server
    try {
      var propData = this.props.data;
      var playerNodes = this.props.data.players.map(function(player) {
        return (
          <OtherPlayer className="activePlayerNode" name={player.name} readyToPlay={player.readyToPlay} chips={player.chips} hasHadTurn={player.hasHadTurn} hasFolded={player.hasFolded} playerHand={player.playerHand} playerNumber={player.playerNumber} activePlayerNumber={propData.activePlayer} />
        );
      });
      return (
        <div className="OtherPlayersList">
          {playerNodes}
        </div>
      );
      // If it can't get the data, then log an error
    } catch (e) {
      console.log("Couldn't render the OtherPlayersBox class");
      console.log(e);
      return(<div>Loading...</div>);
    }

  }

});
