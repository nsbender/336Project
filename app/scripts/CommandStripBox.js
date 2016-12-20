import React from 'react';
import $ from 'jquery';

import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
  check: function() {
    $.ajax({
      url: API_URL + "/" + this.props.data.roomName + "/check",
      type: 'GET'
    })
    .done(function(){
      this.params.reloadCallback();
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  fold: function() {
    $.ajax({
      url: API_URL + "/" + this.props.data.roomName + "/fold",
      type: 'GET'
    })
    .done(function(){
      //Dunno what to do
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  callBet: function() {
    $.ajax({
      url: API_URL + "/" + this.props.data.roomName + "/call",
      type: 'GET'
    })
    .done(function(){
      //Dunno what to do
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  raiseBet: function() {
    var amount = parseInt(prompt("How much do you want to raise the bet?", "For best results, use integers only!"));
    $.ajax({
      url: API_URL + "/" + this.props.data.roomName + "/raise/" + amount.toString(),
      type: 'GET'
    })
    .done(function(){
      //Dunno what to do
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  setReady: function() {
    $.ajax({
      url: API_URL + "/" + this.props.data.roomName + "/ready",
      type: 'GET'
    })
    .done(function(){
      this.params.reloadCallback();
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  render: function() {
    try {
      // console.log(this.props);
      if (!this.props.data.privateUserData.readyToPlay) {
        return (
          <div className="CommandStripBox">
          Click the button when all players are ready to play: &nbsp;&nbsp;
            <button onClick={this.setReady}>
              Ready!
            </button>
          </div>
        );
      }
      else if (this.props.data.currentRoundBettingAmountPerPlayer > this.props.data.privateUserData.roundBetAmount) {
        return (
          <div className="CommandStripBox">
            <button onClick={this.callBet}>
              Call Bet
            </button>
            <button onClick={this.fold}>
              Fold
            </button>
          </div>
        );
      }
      else if (this.props.data.activePlayer == this.props.data.privateUserData.playerNumber) {
        return (
          <div className="CommandStripBox">
            <button onClick={this.check}>
              Check
            </button>
            <button onClick={this.fold}>
            Fold
            </button>
            <button onClick={this.raiseBet}>
              Raise Bet
            </button>
          </div>
        );
      }
      else if (this.props.data.privateUserData.hasFolded) {
        return (
          <div className="CommandStripBox">
            <h1>You&#8217;ve folded this round</h1>
          </div>
        );
      }
      else {
        return (
          <div className="CommandStripBox">
            <h1>Waiting for your turn...</h1>
          </div>
        );
      }
    } catch (e) {
      return (
        <div className="CommandStripBox">
          <h1>Loading data...</h1>
        </div>
      );
    }
}
});
