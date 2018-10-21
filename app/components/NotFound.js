import React, { Component } from "react"
import ReactDOM from "react-dom"
import "../css/style.css"
//class Notfound extends React.Component{
//  render(){
//      return (
//          <h1 className="title">404 Not Found</h1>
//      )
//  }
//}
//export default Notfound
class NewsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [
        { tabName: "热点新闻", id: 1 },
        { tabName: "合作播报", id: 2 },
        { tabName: "行业咨询", id: 3 },
        { tabName: "运营攻略", id: 4 }
      ],
      currentIndex: 1
    }
  }
  componentDidMount() {}
  tabChoiced(id) {
    // tab切换的方法
    this.setState({
      currentIndex: id
    })
  }
  render() {
    var _this = this
    var tabList = this.state.tabs.map(
      function(res, index) {
        // 遍历标签页，如果标签的id等于tabid，那么该标签就加多一个active的className
        var tabStyle =
          res.id == this.state.currentIndex ? "subCtrl active" : "subCtrl"

        return (
          <li
            key={index}
            onClick={this.tabChoiced.bind(_this, res.id)}
            className={tabStyle}
            style={{ cursor: "pointer", float: "left" }}
          >
            {res.tabName}
          </li>
        )
      }.bind(_this)
    )
    return (
      <div className="listWrap">
        <ul className="subNavWrap">{tabList}</ul>
        <div className="newsList">{/**这里通用的新闻列表**/}</div>
      </div>
    )
  }
}

export default NewsList
