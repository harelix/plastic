import {Link} from 'react-router';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";


class HomePage extends React.Component{
    render() {
        return (
            <div className="jumbotron">
                <h1>Plastic</h1>
                <p>Main page for plastic.js</p>
            </div>
        );
    }
}

export default HomePage;