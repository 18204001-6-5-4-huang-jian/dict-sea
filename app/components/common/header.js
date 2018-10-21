import React, { Component } from "react"
import { hashHistory, browserHistory, Link } from "react-router"
import Cookie from "js-cookie"
import "../../css/header.css"
import { message } from 'antd'

class AbcHeader extends Component {
  constructor() {
    super()
    this.state = {
      keyword: '',
      userinfo: JSON.parse(localStorage.getItem('userinfo')) || {},
      showPanel: false
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.clickEvent)
  }

  componentWillUnmount() {
    // window.removeEventListener('keyup', this.enterEvent)
  }
  clickEvent = (e) => {
    if (e.target.className == 'user' || e.target.className == 'username' || e.target.className == 'usernamelogo') {
    } else {
      if (this.state.showPanel) {
        this.setState({
          showPanel: false
        })
      }
    }
  }

  confirmSearch = () => {
    if (!this.state.keyword.trim().length) {
      message.info('搜索内容不能为空');
    } else {
      // this.props.router.push({ pathname: '/select', query: { q: this.state.keyword } })
      hashHistory.push({ pathname: '/select', query: { q: this.state.keyword } })
    }
  }

  keywordChange = e => {
    const value = e.target.value
    this.setState({
      keyword: value
    })
  }

  enterEvent = e => {
    const key = e.key.toLowerCase()
    if (key === 'enter') {
      return this.confirmSearch()
    }
  }

  toggleUserPanel = () => {
    this.setState((prevState, props) => {
      const state = prevState
      state.showPanel = !prevState.showPanel
      return state
    })
  }

  userLogout = () => {
    Cookie.remove('token')
    localStorage.removeItem('userinfo');
    localStorage.removeItem('token');
    localStorage.removeItem("role");
    // message.success('退出登录成功');
    hashHistory.push('/login');
  }

  render() {
    return (
      <div className="head">
        <div className="dicHead">
          <Link to="/dictionManager" className="manager">
            词库管理平台
          </Link>
          <Link to="/dictionManager" className={`tab ${this.props.location.pathname === '/dictionManager' || this.props.location.pathname.indexOf('/details') != -1 ? 'active' : ''}`}>
            词库总览
          </Link>
          <Link to="/demandList" className={`tab ${this.props.location.pathname === '/demandList' ? 'active' : ''}`}>
            需求管理
          </Link>
          <Link to="/controlChart" className={`tab ${this.props.location.pathname === '/controlChart' ? 'active' : ''}`}>
            运行监控
          </Link>
          <Link to="/rightManagement" className={`tab ${this.props.location.pathname === '/rightManagement' ? 'active' : ''}`}>
            权限管理
          </Link>
          <Link to="/update" className={`tab ${this.props.location.pathname.indexOf("/update") != -1 ? 'active' : ''}`}>
            审核更新
          </Link>
          <Link to="/feedBack" className={`tab ${this.props.location.pathname.indexOf("/feedBack") != -1 ? 'active' : ''}`}>
            反馈处理
          </Link>
          <div className="searchdic">
            <input
              type="text"
              placeholder="请输入您想查找的内容"
              onChange={this.keywordChange}
              className="text"
              onKeyUp={this.enterEvent}
            />
            <img
              src="../images/preview7.png"
              alt=""
              className="pic"
              onClick={this.confirmSearch}
            />
          </div>
          <Link to="/dicApi" className="icon">

          </Link>
          <div className="user" onClick={this.toggleUserPanel}></div>
          <div className="username" onClick={this.toggleUserPanel}>{this.state.userinfo.nickname}</div>
          <div className="usernamelogo" onClick={this.toggleUserPanel}></div>
          <div className="userInfo" style={{ display: this.state.showPanel ? 'block' : 'none' }}>
            <div className="userManager"> {this.state.userinfo.role}</div>
            <div className="userlogo"></div>
            <h4 className="user-name">
              {this.state.userinfo.nickname}
            </h4>
            <p className="user-email">
              {this.state.userinfo.email}
            </p>
            <a href="javascript:void(0)" className="user-logout" onClick={this.userLogout}>退出登录</a>
          </div>
        </div>
      </div>
    )
  }
}

export default AbcHeader
