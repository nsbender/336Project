import React from 'react';
import $ from 'jquery';

module.exports = React.createClass({
  render: function() {
    try {
      var messages = this.props.data.messageLog.map(function(message) {
        return (
          <li>{message}</li>
        );
      });
      return (
        <div className="GameLog">
          <h1>Game Events</h1>
          <div className="contents">
            <ul>
              {messages}
            </ul>
          </div>
        </div>
      );
    }
    catch (e) {
      console.log("Couldn't render the GameLog class");
      console.log(e);
      return(<div>Loading...</div>);
    }
  }
});
