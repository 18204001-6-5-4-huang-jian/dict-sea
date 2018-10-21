import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link, withRouter } from "react-router"
import AbcHeader from "./common/header"
import ActionBar from './updateSlide/action'
import Slide from './updateSlide/slide'
import "../css/update.css"
import "../css/tab.css"

@withRouter
class Updates extends React.Component{
	constructor(props){
		super(props)
		this.state = {
          			
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){

	}
    render() {
  	return (
  	   <div className='update-content'>
         <AbcHeader {...this.props} />
         <div className="update-container">
         	<Slide cname={this.props.params.class_name} id={this.props.params.class_index}/>
         	<div className="updates">
         	<ActionBar/>
            {this.props.children}
         	</div>
         </div>
       </div>
  	 )
   }
}
export default  Updates
