import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { shouldRender } from "../../../src/utils";
import { DocumentsSelector } from './DocumentsSelector';

export class TypesSelector extends Component {
  
    static defaultProps = {
      types: {},
    };
  
    
    constructor(props) {
      super(props);
      this.state = { 
        current : null,
        types : null
      };
    }
  
    shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }
  
    componentWillReceiveProps(nextProps){
      let { types , index} = nextProps;
      this.setState({types  , index });
    }
    componentDidMount(){}
  
    fetchMappingsForType = () => {
      let { current, types } = this.state;
      let type = types[current];
      this.setState({mappings : type.mappings});
    };
  
    onLabelClick = type => {
      return event => {
      
        event.preventDefault();
        this.setState({ current: type  });
  
        this.props.onSelected('http://localhost:8080/api/elastic/mapping/'+
            this.state.index +'/' + type);
  
        setImmediate(() => {this.fetchMappingsForType();
        });
      };
    };
  
    buildURLForMappings(){
      let { current , mappings} = this.state;
    }
  
    render() {
      const { types } = this.props;
  
      return (
        <div>
          <ul className="nav nav-pills">
            {Object.keys(types).map((key, idx) => {
              return (
                <li
                  key={idx}
                  role="presentation"
                  className={this.state.current === key ? "active" : ""}>
                  <a href="#" onClick={this.onLabelClick(key)}>
                    {key}
                  </a>
                </li>
              );
            })}
          </ul>
          <DocumentsSelector index={this.state.index} type={this.state.current} onDocumentSelected={this.props.onDocumentSelected}/>
        </div>
      );
    }
  }
  
  
  TypesSelector.propTypes = {
    onDocumentSelected:PropTypes.func,
    types: PropTypes.object,
    index: PropTypes.string
  }
  
  