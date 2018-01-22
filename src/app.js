import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { Link, Switch, Route }  from 'react-router-dom';

//import Sidebar from './plastic/components/sidebar/Sidebar';
import MainEditor  from './plastic/components/main/MainEditor';
import IndicesAndTypes from './plastic/components/indices/IndicesAndTypes';
import DocumentsSearch from './plastic/components/search/DocumentsSearch';
import DocumentEditor from './plastic/components/editor/DocumentEditor';


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


const Sidebar = () => (
    <sidebar>
      <Switch>
        <Route exact path='/' component={MainEditor}/>
        <Route path='/indices_and_types' component={IndicesAndTypes}/>
        <Route path='/documents_search/:index?' component={DocumentsSearch}/>
        <Route path='/document_editor/:uuid?' component={DocumentEditor}/>
      </Switch>
    </sidebar>
  )

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainEditor}/>
      <Route path='/indices_and_types' component={IndicesAndTypes}/>
      <Route path='/documents_search/:index?' component={DocumentsSearch}/>
      <Route path='/document_editor/:uuid?' component={DocumentEditor}/>
    </Switch>
  </main>
)

export default App;