import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import "../css/dictionManager.css"
import AbcHeader from "./common/header"
import { getCardsData, getCoverData } from '../api'

export default class One extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      coverData: {},
      query: null,
      coverDatanumber: null,
      totalFull: null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  async componentDidMount() {
    const [cardData, coverData] = await Promise.all([getCardsData(), getCoverData()])
    this.setState({
      data: cardData.data.data.list,
      coverData: coverData.data.data,
      coverDatanumber: ((1 - coverData.data.data.query_cover_rate) * 100).toFixed(2),
      totalFull: ((coverData.data.data.total_cover_rate) * 100).toFixed(2),
      query: (coverData.data.data.query_cover_rate * 100).toFixed(2)
    })
  }

  render() {
    const containers = this.state.data.map((item, index) => (
      <Link
        className="container"
        key={index}
        to={{ pathname: `/details/${item.index_id}`, query: { cname: item.cname } }}
      >
        <p className="main_title">{item.cname} </p>
        <div className="top">
          <p> {item.word_count}</p>
          <p> 总词条数</p>
        </div>
        <div className="bottom">
          <p className="left">
            <span>{item.yes_update_count}</span>
            <br />
            <span className="span">昨日新增</span>
          </p>
          <span className='middle'></span>
          <p className="right">
            <span>{((item.cover_rate) * 100).toFixed(2)}%</span>
            <br />
            <span className="span">同义词覆盖率</span>
          </p>
        </div>
      </Link>
    ))

    return (
      <div className="dicManager">
        <AbcHeader {...this.props} />
        <div className="dataShow">
          <div className="top">
            <div className="left">
              <p className="dicTotal">
                {this.state.coverData.total_word_count}
              </p>
              <p>今日总词条数</p>
            </div>
            <div className="center">
              {this.state.query}%
            </div>
            <div className="right">
              <p>Query覆盖率({this.state.coverData.create_time})</p>
              <div>
                <p className="rate">{this.state.query}%</p>
                <p>搜索与词典均已覆盖</p>
              </div>
              <div>
                <p className="rate">{this.state.coverDatanumber}%</p>
                <p>词典未覆盖</p>
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="left">
              <span>昨日新增:</span>
              <span>{this.state.coverData.yes_update_count}</span>
            </div>
            <div className="right">
              <span>同义词覆盖率:</span>
              <span>{this.state.totalFull}%</span>
            </div>
          </div>
        </div>

        <div className="main">{containers}</div>
      </div>
    )
  }
}
