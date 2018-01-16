import React, { Component } from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { shouldRender } from "../../../../src/utils";

export class SearchBox extends Component {
  

    static defaultProps = {
      types: {},
    };
  
    
    constructor(props) {
      super(props);
      
      this.state = { 
        input : ''
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
   

    handleChange = (e) => {
        this.setState({ input: e.target.value });
    }
    
    handleClick = () => {
        console.log(this.state.input);
    }

    render() {
      const { documents } = this.state;
  
      return (
        <div>
            <form>
                <div class="input-group mb-3">
                    <input type="text" onChange={ this.handleChange } class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button"
                         onClick={this.handleClick}>Button</button>
                    </div>
                </div>
            </form>
        </div>
      );
    }
  }
  
  
  SearchBox.propTypes = {
    onSearchClick: PropTypes.func
  }
  
  