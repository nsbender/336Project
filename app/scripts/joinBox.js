import React from 'react';
import $ from 'jquery';
import { browserHistory } from 'react-router';
import { API_URL, POLL_INTERVAL } from './global';

import feltImage from '../images/felt.jpg'

module.exports = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadGamesFromServer: function() {
    $.ajax({
      url: API_URL,
      dataType: 'json',
      cache: false,
    })
    .done(function(result){
      this.setState({data: result});
    }.bind(this))
    .fail(function(xhr, status, errorThrown) {
      console.error(this.props.url, status, errorThrown.toString());
    }.bind(this));
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
    //but TODO: first we should make sure that the ID is contained in the 'data' we retrieved
    //earlier in loadGamesFromServer();
    browserHistory.push('/' + text);
  },
  handleCreate: function(e) {
    e.preventDefault();
    //Not sure what happens here yet
  },
  render: function() {
    return (
      <div>
        <h1 type="title">CalvinPoker.club</h1>
        <div className="homepageBox">
        Hi Professor!

        I have been at it all night, and I'm happy to say that the gameplay works completely now!  The homepage does not though.<br />
        So, to demo it I have set up a sample game with two players.  Best thing to do is use a regular chrome window for one player
        and an incognito window for the second one.<br /><br />
        To set up the game as player 1 (you), go to /api/setcookie/p1 in your browser.  <br />To become player 2, go to /api/setcookie/p2
        <br /><br />To start the game, go to /kvldemo in your browser windows after setting the cookies.<br /><br />
        Also, for some reason the non-dev server keeps adding trailing slashes to the URLs, which mess up the images.  I haven't been able to figure out a fix other than to use the dev server.
        </div>
        <br/><br/><br/><br/><br/><br/>
        <h2>Create a new game, or enter the id of an already existing game in the field below</h2>

        <div style={{paddingTop:'128px'}}>
        <form onSubmit={this.handleCreate} style={{display: 'flex', justifyContent: 'center'}}>
          <input className="ui-button ui-widget ui-corner-all" type="submit" value="Create Game" />
        </form>
        <h2 style={{display: 'flex', justifyContent: 'center'}}>Or</h2>
        <form onSubmit={this.handleJoin} style={{display: 'flex', justifyContent: 'center'}}>
          <input className="ui-widget ui-corner-all" type="text" placeholder="Game Name"
          value={this.state.sessionID} onChange={this.handleTextChange}
          />
          <input className="ui-button ui-widget ui-corner-all" type="submit" value="Join Game" />
        </form>
        </div>
      </div>
    );
  }
});
