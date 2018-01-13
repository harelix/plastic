import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { shouldRender } from "../../../src/utils";

export class DocumentsSelector extends Component {
  

    static defaultProps = {
      types: {},
    };
  
    
    constructor(props) {
      super(props);
      
      this.state = { 
        current : null,
        requestDispatched : false,
        index: {},
        type : {},
        documents : {}
      };
    }
  
    shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }
  
    componentWillReceiveProps(nextProps){
      let { index , type } = nextProps;
      this.setState({index  , type });

      if(index && type){
        this.fetchDocumentsForIndexAndType(index, type);
      }
    }
   
    fetchDocumentsForIndexAndType = (index, type) => {
      
      if(this.state.requestDispatched) return;
      this.state.requestDispatched = true;

      fetch('http://localhost:8080/api/elastic/document/all/{0}/{1}'.format(index, type))
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({documents : responseJson})
          })
          .catch((error) => {
            console.error(error);
        });
    };

    onLabelClick = document => {
      return event => {
        
        event.preventDefault();
        this.setState({ current: document  });
        debugger;
        this.props.onDocumentSelected(this.state.index,  this.state.type , document);
        setImmediate(() => {this.fetchMappingsForType();
        });
      };
    };

    buildURLForMappings(){
      let { documents , current } = this.state;
    }
  
    render() {
      const { documents } = this.state;
  
      return (
        <div>
          <ul className="nav nav-pills">
            {Object.keys(documents).map((key, idx) => {
              return (
                <li
                  key={idx}
                  role="presentation"
                  className={this.state.current === key ? "active" : ""}>
                  <a href="#" onClick={this.onLabelClick(documents[key])}>
                    {documents[key]._source.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }
  
  
  DocumentsSelector.propTypes = {
    onDocumentSelected: PropTypes.func,
    index: PropTypes.string,
    type: PropTypes.string,
  }
  
  