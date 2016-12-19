import React from 'react';
import $ from 'jquery';

import Card from './Card.js'


module.exports = React.createClass({

  render: function() {
    try {
      var communityCards = this.props.data.communityCards.map(function(card) {
        return (
          //<Card filename={card.Filename} description={card.string}/>
          <Card className="largeCardImage" filename={card.Filename} description={card.string}/>
        );
      });
      return (
        <div className="TableBox">
          {communityCards}
        </div>
      );
    }
    catch (e) {
      console.log("Couldn't render the TableBox class");
      console.log(e);
      return(<div>Loading...</div>);
    }
  }


});
