import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, Redirect, hashHistory } from "react-router"
import axios from "axios"
import DevTools from 'mobx-react-devtools'
import { Provider } from 'mobx-react'
//从Stores中引入
import RootStore from './stores'
// 初始化store实例
const rootStore = new RootStore()
//引入路由
import Login from "./components/Login"
import DictionManager from "./components/DictionManager"
import Select from "./components/Select"
import DicApi from "./components/DicApi"
import Details from "./components/Details"
import List from './components/details/list'
import DemandList from "./components/DemandList"
import DataRequest from "./components/DataRequest"
import ControlChart from "./components/ControlChart"
import RightManagement from './components/RightManagement'
import FeedBack from './components/feedback'
import FeedBackList from './components/feedBack/list'
import Update from "./components/Update"
import Readonly from "./components/Readonly"
import UpdateList from './components/updateSlide/list'
import Links from "./router"
import NotFound from "./components/NotFound"
import { enteRouter, leaveRouter } from './routerTest'

//配置路由
ReactDOM.render(
  <Provider {...rootStore}>
    <Router history={hashHistory}>
      <div>
        <Links />
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/dictionManager" component={DictionManager} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="/select" component={Select} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="/dicApi" component={DicApi} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="/details/:id" component={Details}>
          <Route path="/details/:id/detail/:cname" component={List} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        </Route>
        <Route path="/demandList" component={DemandList} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="/dataRequest" component={DataRequest} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="/controlChart" component={ControlChart} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="rightManagement" component={RightManagement} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        <Route path="/feedBack" component={FeedBack}>
          <Route path="/feedBack/:class_index/feedBack/:class_name" component={FeedBackList} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        </Route>
        <Route path="/update" component={Update}>
          <Route path="/update/:class_index/updates/:class_name" component={UpdateList} onEnter={enteRouter.bind(this)} onLeave={leaveRouter.bind(this)} />
        </Route>
        <Route path="/reaonlyshow" component={Readonly} />
        {/* 404 Not Found页面 */}
        <Route component={NotFound} />
        <DevTools />
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
)
