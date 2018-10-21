import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import AbcHeader from "./common/header"
import Slide from './feedBack/slide'
import ActionBar from './feedBack/actions'
import "../css/feedback.css"
import "../css/tab.css"

class FeedBack extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        data:[]
    }
  }
  componentWillMount(){
          
  }
  componentDidMount(){
        
  }
  render(){
    return (
      <div className='feedback-content'>
         <AbcHeader {...this.props} />
         <div className="feedback-container">
         	<Slide cname={this.props.params.class_name} id={this.props.params.id}/>
         	<div className="feedbacks">
         	  <ActionBar/>
            {this.props.children}
         	</div>
         </div>
      </div>
    )
  }
}
export default FeedBack
