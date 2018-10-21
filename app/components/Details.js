import React, { Component } from "react"
import "../css/details.css"
import "../css/tab.css"
import SideBar from "./details/side"
import AbcHeader from "./common/header"
import ActionBar from './details/actions'
import { Route } from 'react-router'
import { observer, inject } from 'mobx-react'

@inject('listStore','detailStore','updateStore') @observer
class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      detail: {}
    }
  }
  componentDidMount(){
    // console.log(this.props.params.id);
  }
  componentDidUpdate(){
    //console.log(this.props);
  }
  render() {
    const { listStore,detailStore,updateStore }  = this.props;
    return (
      <div className='details-content' style={{ display: "block" }}>
        <AbcHeader {...this.props} />
        <div className="detail-container">
          <SideBar cname={this.props.location.query.cname} id={this.props.params.id} rid={this.props.params.rid} />
          <div className="details">
            <ActionBar />
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
export default Details
