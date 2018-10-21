import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory } from 'react-router'
import { notification, message } from 'antd'
import "../css/style.css"
import "../css/select.css"
import search from "../images/search.png"
import { getClassSearchResults, getSynonymsSearchResults } from "../api"
class Select extends React.Component {
  //状态机
  constructor(props) {
    super(props)
    this.state = {
      wordArray: [], // 同义词
      thesaurusArray: [], // 分类
      keyword: "",
      loading: true
    }
  }

  componentDidMount() {
    // console.log(this.props);
    if (this.props.location.query.q == undefined) {
      if (localStorage.getItem('token') && localStorage.getItem('role') && localStorage.getItem('userinfo')) {
        // message.info('请输入关键字查询');
        return this.props.router.push('/dictionManager');
      } else {
        return this.props.router.push('/login');
      }
    } else {
      const keyword = this.props.location.query.q;
      this.setState({
        keyword: keyword
      }, () => {
        this.confirmSearch();
      })
    }
    window.addEventListener("keyup", this.enterEvent)
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.enterEvent)
  }

  enterEvent = (e) => {
    if (e.keyCode === 13) {
      this.confirmSearch();
    }
  }

  async confirmSearch() {
    const keyword = this.state.keyword;
    // console.log(keyword);
    if (!keyword.trim().length) {
      message.info("请输入关键词");
    }
    try {
      const [wordArray, thesaurusArray] = await Promise.all([
        getClassSearchResults(keyword),
        getSynonymsSearchResults(keyword)
      ])
      await this.setState({
        thesaurusArray: [],
        wordArray: []
      })
      await this.setState((prevState, props) => {
        thesaurusArray && (prevState.wordArray = thesaurusArray.data.data.list)
        wordArray && (prevState.thesaurusArray = wordArray.data.data.list)
        return prevState
      })
      this.setState({
        loading: false
      })
      hashHistory.replace({ pathname: '/select', query: { q: keyword } })
    } catch (e) {
      notification.error({
        message: e.message,
        description: e.toString()
      })
    }
  }

  keyWordChange = e => {
    //表单change事件
    const value = e.target.value
    this.setState({
      keyword: value
    })
  }

  render() {
    const thesaurusDiv = this.state.thesaurusArray.map((item, index) => {
      return (
        <div key={index} className="content">
          {item.classification}
        </div>
      )
    })
    const wordArrayDiv = this.state.wordArray.map((item, index) => {
      return (
        <div key={index} className="synonym-content">
          <div className="content-container-title">{item.classification}</div>
          {/* <div className="content-container-synonym-items"> */}
          {item.synonyms.map((item, index) => {
            return (
              <div key={index} className="content-container-synonym-item">{item}</div>
            )
          })}
          {/* </div> */}
        </div>
      )
    })
    return (
      <div className="box">
        <h1 className="dict-title">词库查询</h1>
        <div className="input-container">
          <input
            type="search"
            className="search"
            value={this.state.keyword}
            onChange={this.keyWordChange}
          />
          <input
            type="button"
            className="button"
            value="搜 索"
            onClick={this.confirmSearch.bind(this)}
          />
          <img
            src={search}
            alt=""
            className="image"
            onClick={this.confirmSearch.bind(this)}
          />
        </div>
        <div className="result-container" style={{ display: this.state.loading ? 'none' : 'block' }}>
          <div className="select-box">
            <div className="box box-top">
              <div className="box-left" style={{ color: this.state.thesaurusArray.length ? '#000' : 'red' }}>词性类别 : </div>
              <div className="box-right">{!this.state.thesaurusArray.length ? <span style={{ color: 'red' }}>无结果</span> : thesaurusDiv}</div>
            </div>
            <div className="box">
              <div className="box-left" style={{ color: this.state.wordArray.length ? '#000' : 'red' }}>同义词 : </div>
              <div className="box-right">{!this.state.wordArray.length ? <span style={{ color: 'red' }}>无结果</span> : wordArrayDiv}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Select
