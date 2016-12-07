import React from 'react';
import $ from 'jquery';
import { browserHistory } from 'react-router';

module.exports = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleJoin: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.setState({ text: ''});
    //join game with the id contained in 'text'
    browserHistory.push('/' + text);
  },
  handleCreate: function(e) {
    e.preventDefault();
    //Not sure what happens here yet
  },
  render: function() {
    return (
      <div>
      <h1>Welcome To PokerStars.net</h1>
      <h2>Create a new game, or enter the id of an already existing game in the field below</h2>
      <form onSubmit={this.handleCreate}>
      <input className="ui-button ui-widget ui-corner-all" type="submit" value="Create Game" />
      </form>
      <form onSubmit={this.handleJoin}>
      <input className="ui-widget ui-corner-all" type="text" placeholder="Game Name"
      value={this.state.sessionID} onChange={this.handleTextChange}
      />
      <input className="ui-button ui-widget ui-corner-all" type="submit" value="Join Game" />
      </form>
      </div>
    );
  }
});
