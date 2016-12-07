import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import gameBox from './gameBox.js';
import joinBox from './joinBox.js'
import '../css/base.css';

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={JoinBox}/>
        <Route path="/:id" component={GameBox} />
    </Router>
), document.getElementById('content')
);
