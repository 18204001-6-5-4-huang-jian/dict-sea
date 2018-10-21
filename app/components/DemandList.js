import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import "../css/demandList.css"
import AbcHeader from "./common/header"
import { getDemandsList } from '../api'
import Table from 'antd/lib/table'
import { message } from 'antd'
import 'antd/lib/table/style'

class DemandList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      keyword: ''
    }
  }
  async componentDidMount () {
    // const response =  await getDemandsList(...this.props.location.query);
    const response =  await getDemandsList()
    if(!response){
      message.error('获取列表失败，请检查您的网络原因!');
    }else{
     const data = response.data.data.list;
     this.setState({
      data: data
      })
    }
   
  }

  async handleSearch () {
    const response = await getDemandsList({q: this.state.keyword});
    if(!response){
      message.error('搜索关键词失败，请检查您的网络原因!');
    }else{
        this.setState((prevState, props) => {
        prevState.data = response.data.data.list;
        return prevState;
      })
    }
  }

  handleEnterEvent = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      this.handleSearch()
    }
  }

  render() {
    const columns = [
      {
        title: '创建日期',
        dataIndex: 'create_time'
      }, 
      {
        title: '词性分类',
        dataIndex: 'classification'
      }, 
      {
        title: '数据源',
        dataIndex: 'data_source'
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        filters: [
          {text: '高', value: '高'},
          {text: '中', value: '中'},
          {text: '低', value: '低'}
        ],
        onFilter: (value, record) => {
          return record['priority'] === value;
        }
      },
      {
        title: '创建者',
        dataIndex: 'creator'
      },
      {
        title: '开发人员',
        dataIndex: 'developer'
      },
      {
        title: '当前进度',
        dataIndex: 'progress',
        filters: [
          {text: '未提交需求', value: '未提交需求'},
          {text: '提交开发', value: '提交开发'},
          {text: '入库完成', value: '入库完成'}
        ],
        onFilter: (value, record) => {
          return record['progress'] === value;
        },
        render(progress){
          if(progress === '提交开发'){
            return <span style={{color:'#3299FF'}}>提交开发</span>
          }else if(progress === '入库完成'){
            return <span style={{color:'#1DAC00'}}>入库完成</span>
          }else if(progress === '未提交需求'){
            return <span style={{color:'#FF0000'}}>未提交需求</span>
          }
        }
      }
    ]
    
    return (
      <div className="demandList">
        {/*头部tab栏内容*/}
        <AbcHeader {...this.props} />

        {/*搜索栏部分*/}
        <div className="search">
          <div className="left">词典库数据请求清单</div>
          <div className="searchBar">
            <input 
              type="text" 
              placeholder="输入您想查找的内容" 
              value={this.state.keyword} 
              onChange={(e) => this.setState({keyword: e.target.value})} 
              onKeyUp={this.handleEnterEvent}
            />
            <img style={{cursor:'pointer'}} src="../images/preview7.png" alt="" onClick={this.handleSearch.bind(this)} />
          </div>
          <Link to="/dataRequest" className="rightBtn">新建数据请求</Link>
        </div>

        {/*列表部分*/}
        <div className="list">
          <Table 
            dataSource={this.state.data} 
            columns={columns} 
            rowKey="id" 
            pagination={true} 
          />
        </div>
      </div>
    )
  }
}
export default DemandList
