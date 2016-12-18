import React from 'react';
import $ from 'jquery';
import { API_URL, POLL_INTERVAL } from './global';

import OtherPlayersBox from './OtherPlayersBox.js'
import TableBox from './TableBox.js'
import CommandStripBox from './CommandStripBox.js'
import PlayerInfoBox from './PlayerInfoBox.js'

import '../css/base.css';

module.exports = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadGameDataFromServer: function() {
    $.ajax({
      url: API_URL + this.props.params.id,
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
  componentDidMount: function() {
    this.loadGameDataFromServer();
    setInterval(this.loadGameDataFromServer, POLL_INTERVAL);
  },
  render: function() {
    // console.log(this.state.data);
    return (
      <div>
        <OtherPlayersBox data={this.state.data} />
        <TableBox />
        <CommandStripBox />
        <PlayerInfoBox />
      </div>
    );
  }

});
