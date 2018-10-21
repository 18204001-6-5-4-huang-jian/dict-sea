import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory } from "react-router"

export const enteRouter = function(){
	if(localStorage.getItem("token") === null && localStorage.getItem("userinfo") === null){
	    //处理未登录状态
	    hashHistory.push({  
          pathname: '/', 
    })        
  }
}

export const leaveRouter = function(){
	//console.log("路由");
}