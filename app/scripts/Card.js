import React from 'react';
import $ from 'jquery';


module.exports = React.createClass({
  render: function() {
    var URL = "http://christiaan.us/playingcards/" + this.props.filename;
    var altText = this.props.description
    return (
      <img className="smallCardImage" src={URL} alt={altText} />
    );
  }
});
