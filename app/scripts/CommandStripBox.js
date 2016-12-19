import React from 'react';
import $ from 'jquery';

import { API_URL, POLL_INTERVAL } from './global';

module.exports = React.createClass({
  getInitialState: function() {
    return {data: []};
  },

  check: function() {
    $.ajax({
      url: API_URL + "/" + this.props.gameID + "/check",
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
      url: API_URL + "/" + this.props.gameID + "/call",
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
    $.ajax({
      url: API_URL + "/" + this.props.gameID + "/raise",
      type: 'GET'
    })
    .done(function(){
      //Dunno what to do
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  fold: function() {
    $.ajax({
      url: API_URL + "/" + this.props.gameID + "/fold",
      type: 'GET'
    })
    .done(function(){
      //Dunno what to do
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(API_URL, status, errorThrown.toString());
    }.bind(this));
  },

  render: function() {
      return (
        <div className="CommandStripBox">
          <button onClick={this.check}>
            Check
          </button>
          <button onClick={this.callBet}>
            Call Bet
          </button>
          <button onClick={this.raiseBet}>
            Raise Bet
          </button>
          <button onClick={this.fold}>
            Fold
          </button>
        </div>
      );
  }

});
