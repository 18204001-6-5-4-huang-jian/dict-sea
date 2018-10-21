import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import "../css/dataRequest.css"
import AbcHeader from "./common/header"
import { createDemand } from "../api"
import {message} from 'antd'
class DataRequest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classification: "",
      explain: "",
      data_source: "",
      standard: "",
      update_freq: "日",
      developer: "john",
      priority: "高",
      progress: "未提交开发"
    }
  }
  handleChange(event) {
    var newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState)
  }

  async handleSubmit(e) {
    e.preventDefault();
    //判断输入项是否为空
    if(!this.state.classification.trim().length){
        message.warning('词性分类不可以为空，请输入词性分类');
        return;
    }
    if(!this.state.explain.trim().length){
        message.warning('需求说明不可以为空，请输入需求说明');
        return;
    }
    if(!this.state.data_source.trim().length){
        message.warning('数据源不可以为空，请输入数据源');
        return;
    }
    if(!this.state.standard.trim().length){
        message.warning('选择标准不可以为空，请输入选择标准');
        return;
    }
    const response = await createDemand(this.state);
    if(!response){
      message.error('创建失败，请检查网络原因');
    }else{
      hashHistory.push("/demandList");
    }
  }
  render() {
    return (
      <div className="dataRequest">
        <AbcHeader {...this.props} />
        <div className="dataRequest_title">
          <div className="title_con">
            <div className="return">
              <Link to="/DemandList"> 返回上一级</Link>
            </div>
            <div className="line">|</div>
            <div className="left">数据需求 :</div>
          </div>
        </div>
        <div className="container">
          <form action="" className="form">
            <label htmlFor="classification" className="left">
              词性分类 :
            </label>
            <input
              type="text"
              value={this.state.classification}
              name="classification"
              onChange={this.handleChange.bind(this)}
            />
            <br />

            <label htmlFor="explain" className="left">
              需求说明 :
            </label>
            <input
              type="text"
              value={this.state.explain}
              name="explain"
              onChange={this.handleChange.bind(this)}
            />
            <br />

            <label htmlFor="data_source" className="left">
              数据源 :
            </label>
            <input
              type="text"
              value={this.state.data_source}
              name="data_source"
              onChange={this.handleChange.bind(this)}
            />
            <br />

            <label htmlFor="standard" className="left">
              选择标准 :
            </label>
            <input
              type="text"
              value={this.state.standard}
              name="standard"
              onChange={this.handleChange.bind(this)}
            />
            <br />

            <label htmlFor="update_freq" className="select_left">
              更新频率 :
            </label>
            <select
              className="select_right"
              name="update_freq"
              onChange={this.handleChange.bind(this)}
              value={this.state.update_freq}
            >
              <option value="日">日</option>
              <option value="月">月</option>
              <option value="年">年</option>
            </select>
            <br />

            <label htmlFor="developer" className="select_left">
              开发人员 :
            </label>
            <select
              className="select_right"
              name="developer"
              onChange={this.handleChange.bind(this)}
              value={this.state.developer}
            >
              <option value="John">John</option>
              <option value="Bob">Bob</option>
              <option value="susan">susan</option>
            </select>
            <br />

            <label htmlFor="priority" className="select_left">
              优先级 :
            </label>
            <select
              className="select_right"
              name="priority"
              onChange={this.handleChange.bind(this)}
              value={this.state.priority}
            >
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
            <br />

            <label htmlFor="progress" className="select_left">
              当前进度 :
            </label>
            <select
              className="select_right"
              name="progress"
              onChange={this.handleChange.bind(this)}
              value={this.state.progress}
            >
              <option value="未提交开发">未提交开发</option>
              <option value="提交开发">提交开发</option>
              <option value="入库完成">入库完成</option>
            </select>
            <br />

            <button
              type="submit"
              className="create"
              onClick={this.handleSubmit.bind(this)}
            >
              创建
            </button>
          </form>
        </div>
      </div>
    )
  }
}
export default DataRequest
