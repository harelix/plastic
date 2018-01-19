import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './App';
import HomePage from './plastic/components/home/HomePage';
import LoginPage from './plastic/components/login/LoginPage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="/elastic_management" component={LoginPage}/>
    </Route>
);