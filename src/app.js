import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { Link }  from 'react-router-dom';

import Sidebar from './plastic/components/sidebar/Sidebar';
import Main  from './plastic/components/main/Main';


class App extends Component{
    render(){
        return (
            <div>
                <p>Plastic forms for Elastic search</p>
                <Sidebar />
                <Main /> 
            </div>
        );
    }
}


App.PropTypes = {
    children : PropTypes.object.isRequired
};


export default App;