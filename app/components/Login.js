import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory } from "react-router"
// import { withCookies, Cookies } from "react-cookie"
// import { createStore } from "redux"
// import moment from "moment"
import "../css/style.css"
import "../css/login.css"
import Cookie from "js-cookie"
import { userLogin } from '../api'
import { userInfo, type } from "os"
import md5 from 'md5'
import Logo from "../images/logo.png"
import { message, Button } from 'antd'
import PropTypes from 'prop-types'

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      isRemember: false,
      result: "",
      loading: false
    }
  }

  enterKey = (e) => {
    if (e.keyCode === 13) {
      this.confirmLogin({
        email: this.state.email,
        password: md5(this.state.password)
      })
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.enterKey)
    this.loadAccountInfo();
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.enterKey)
  }

  /*判断有没有cookie*/
  loadAccountInfo = () => {
    const accountInfo = Cookie.get('accountInfo');
    if (Boolean(accountInfo) == false) {
      // console.log('没有账号信息');
    } else {
      const index = accountInfo.indexOf('&');
      const userName = accountInfo.substring(0, index);
      const passWord = accountInfo.substring(index + 1);
      this.setState({
        email: userName,
        password: passWord
      })
    }
  }

  /**
   * 确定用户登录
   */
  confirmLogin = async (userInfo) => {
    this.setState({ loading: true });
    // console.log(`用户账号:${userInfo.email}`);
    if (!this.state.email.trim()) {
      message.info("您输入的账号不可以为空");
      this.setState({ loading: false });
      return false;
    }
    if (this.state.email.trim().indexOf('@') == -1) {
      message.info("您输入的账号不符合要求");
      this.setState({ loading: false });
      return false;
    }
    if (!this.state.password.trim()) {
      message.info("您输入的密码不可以为空");
      this.setState({ loading: false });
      return false;
    }
    //请求接口
    const response = await userLogin(userInfo);
    if (!response.data.success) {
      message.info(response.data.msg || '登录失败');
      this.setState({
        loading: false
      })
    } else if (response.data.success) {
      const eightHours = 0.7;
      this.setState({ loading: false });
      Cookie.set("token", response.data.data.token, { expires: eightHours });
      localStorage.setItem('token', response.data.data.token);
      // 保存用户信息
      const userinfo = response.data.data;
      delete userinfo.token;
      localStorage.setItem('userinfo', JSON.stringify(userinfo));
      localStorage.setItem("role", response.data.data.role);
      if (this.state.isRemember) {
        //记住密码
        const accountInfo = this.state.email + '&' + this.state.password;
        Cookie.set('accountInfo', accountInfo, { expires: eightHours })
      } else {
        Cookie.remove('accountInfo');
      }
      //跳转页面
      message.success('登录成功');
      return this.props.router.push('/dictionManager');
      // return hashHistory.push("/dictionManager");
    }
  }

  handleFormInputChange = (e) => {
    const target = e.target;
    this.setState({
      [target.name]: target.value
    })
  }
  handInputClick = () => {
    this.setState({
      isRemember: !this.state.isRemember
    })
  }
  enterLoading = () => {
    this.setState({ loading: true });
  }
  render() {
    return (
      <div className="huang">
        <img className="logo-image" src={Logo} />
        <div className="container">
          <h1 className="title">登 录</h1>
          <div className="login-box">
            <input
              type="text"
              placeholder="账 号"
              value={this.state.email}
              name="email"
              className="input text"
              onChange={this.handleFormInputChange}
            />
            <input
              type="password"
              placeholder="密 码"
              value={this.state.password}
              name="password"
              className="input password"
              onChange={this.handleFormInputChange}
            />
            <label>
              <input
                type="checkbox"
                defaultChecked={this.state.isRemember}
                onClick={this.handInputClick}
              />&nbsp;&nbsp;
            <span>记住密码</span>
            </label>
          </div>
          <div>
            {/* <input
              type="button"
              value="登&nbsp;&nbsp;录"
              className="btnlogin"
              onClick={() => this.confirmLogin({ email: this.state.email, password: md5(this.state.password) })}
            /> */}
            <Button type="primary" loading={this.state.loading} onClick={() => this.confirmLogin({ email: this.state.email, password: md5(this.state.password) })}>
              登&nbsp;&nbsp;录
            </Button>
          </div>
        </div>

      </div>
    )
  }
}
//因为性能的原因,propTypes只是在开发环境里来使用
Login.propTypes = {
  //id: React.PropTypes.string
};