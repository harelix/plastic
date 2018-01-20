
import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { Route }  from 'react-router-dom';

class Main extends React.Component{
    render() {
        return (
            <div className="jumbotron">
                <h1>Main</h1>
                <Route path="/editor/:action" />
            </div>
        );
    }
}

export default Main;