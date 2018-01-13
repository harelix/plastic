import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { shouldRender } from "../../../src/utils";
import { TypesSelector} from './TypesSelector';

export class IndexSelector extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        current :  null,
        indices : {},
        types : {}
      };
    }
  
    shouldComponentUpdate(nextProps, nextState) {
      return shouldRender(this, nextProps, nextState);
    }
  
    componentDidMount(){
       this.fetchIndicesFromElastic();
    }
  
    fetchIndicesFromElastic = () => {
      fetch('http://localhost:8080/api/elastic/indices')
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({indices : responseJson})
          })
          .catch((error) => {
            console.error(error);
        });
    };
  
    fetchTypesForIndex = () => {
      let { current , indices} = this.state;
      let types  = indices[current];
      this.setState({types : types});
    };
  
    onLabelClick = type => {
  
      return event => {
        event.preventDefault();
        this.setState({ current: type  });
        setImmediate(() => {
            this.fetchTypesForIndex();
        });
      };
    };
  
    render() {
      const { indices , types } = this.state;
      return (
        <div>
          <ul className="nav nav-pills">
            {Object.keys(indices).map((key, idx) => {
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
          <TypesSelector index={this.state.current} types={types.mappings} 
            onSelected={this.props.onSelected}
            onDocumentSelected={this.props.onDocumentSelected}/>
        </div>
      );
    }
  }
  
  
  