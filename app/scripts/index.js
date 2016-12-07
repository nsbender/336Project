import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Redirect, browserHistory } from 'react-router';

//import '../css/base.css';

ReactDOM.render((
    <Router history={browserHistory}>
//        <Route path="/" component={CommentBox}/>
//        <Route path="/:id" component={CommentEdit} />
    </Router>
), document.getElementById('content')
);
