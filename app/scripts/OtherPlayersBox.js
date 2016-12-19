import React from 'react';
import $ from 'jquery';

import OtherPlayer from './OtherPlayer.js'


module.exports = React.createClass({
  render: function() {
    // console.log(this.props);
    try {
      var playerNodes = this.props.data.players.map(function(player) {
        return (
          <OtherPlayer className="activePlayerNode" name={player.name} readyToPlay={player.readyToPlay} chips={player.chips} hasHadTurn={player.hasHadTurn} hasFolded={player.hasFolded} playerHand={player.playerHand} />
        );
      });
      return (
        <div className="OtherPlayersList">
          {playerNodes}
        </div>
      );
    } catch (e) {
      console.log("Couldn't render the OtherPlayersBox class");
      console.log(e);
      return(<div>Loading...</div>);
    }

  }

});
