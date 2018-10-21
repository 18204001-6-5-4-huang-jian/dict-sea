import React, { Component } from "react"
import { Link, hashHistory } from "react-router"
import { Tree } from 'antd';
import { getTopMenus, getSubMenus, getAllMenus } from '../../api'
import { observer, inject } from 'mobx-react'
import moment from 'moment'

const TreeNode = Tree.TreeNode

@inject('listStore') @observer
class SiderBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list:[],
      subList: {},
      openedNode: []
    }
  }
  async componentDidMount (){
    const [topMenus, subMenus, allMenus] = await Promise.all([getTopMenus(), getSubMenus(this.props.id), getAllMenus(0)])
    const menu = this.getDeepestItem(allMenus.data.data.filter(item => item.id == this.props.id)) // 获取最深一级菜单
    await this.setState((prevState, props) => {
      prevState.list = allMenus.data.data;
      prevState.subList[props.id] = subMenus.data.data;
      prevState.openedNode = [ this.props.id ];
      return prevState;
    })
    //判断menu存在并且跳转list页面
    menu && hashHistory.push(`/details/${menu.id}/detail/${menu.cname}`)  // 主动加载列表内容
  }
   // 递归获取菜单最深一个可以点击的的链接
   getDeepestItem = (arr) => {
    if (arr.length && arr[0].subs) {
      return this.getDeepestItem(arr[0].subs);
    }

    if (arr.length && !arr[0].subs) {
      return arr[0];
    }
  }
  componentDidUpdate(prevProps, prevState){
        
  }

  handleSelect = (selectedKeys, { node }) => {
    const {listStore} = this.props;
    listStore.listenDatepicker = false;//不显示日期
    listStore.isShowDetail = true;//显示详情
    listStore.columns = [
      {
        title: 'ID',
        dataIndex: 'id' // 基于字符串的值dataIndexs!
      },
      {
        title: '主词',
        dataIndex: 'dict_word',
      },
      {
        title: '同义词',
        dataIndex: 'synonyms',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (date) => moment(date).format("YYYY-MM-DD")
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        render: (date) => moment(date).format("YYYY-MM-DD")
      },
      {
        title: '备注',
        dataIndex: 'remark'
      }
    ];
  	if(selectedKeys.length === 0){
  		return false;
  	}
    if (!!!node.props.dataRef.subs) {
      hashHistory.push(`/details/${selectedKeys}/detail/${node.props.dataRef.cname}`)
    }
  }

  renderTreeNodes = (data) => {
    return data.map((item, index) => {
      if (item.subs && item.subs.length) {
        return (
          <TreeNode title={item.cname} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.subs)}
          </TreeNode>
        )
      }else{
           return (
        <TreeNode {...item}  title={item.cname} key={item.id} dataRef={item} />
        )
      }
    })
  }

  render() {
    return (
      <div className="side-bar">
        <div className="menu-list">
          <Tree
            showLine
            onSelect={this.handleSelect}
            defaultExpandedKeys={[this.props.id]}
            /*defaultExpandedKeys={[this.state.openedNode + '']}*/
          >
            {this.renderTreeNodes(this.state.list)}
          </Tree>
        </div>
      </div>
    )
  }
}

export default SiderBar
