import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactDOM, render } from "react-dom";
import Form from "./components/Form";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './app';

render((
  <Router>
    <App />
  </Router>
), document.getElementById('app'));


if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }