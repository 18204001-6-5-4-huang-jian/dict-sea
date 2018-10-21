import React, { Component } from "react"
import { Link, hashHistory } from "react-router"
import {withRouter} from 'react-router-dom' ;
import { Tree } from 'antd';
import { feedBack, feedBackList } from '../../api'
import { observer, inject } from 'mobx-react'
import moment from 'moment'

const TreeNode = Tree.TreeNode;

@inject('feedbackStore') @observer
export default class Slide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  async componentDidMount() {
    const [ TreeMenus ] = await Promise.all([feedBack()]);
    const menu = this.getDeepestItem(TreeMenus.data.data.list.filter(item => item.id == this.props.id))
    await this.setState((prevState, props) => {
      prevState.list = TreeMenus.data.data.list;
      return prevState;
    })
    menu && hashHistory.push(`/feedBack/${menu.class_index}/feedBack/${menu.class_name}`)
  }

  getDeepestItem = (arr) => {
    if (arr.length && arr[0].subs) {
      return arr[0];
    }
  }

  renderTreeNodes = (data) => {
    return data.map((item, index) => {
      if (item.subs && item.subs.length) {
        return (
          <TreeNode title={item.class_name} key={item.class_index} dataRef={item}>
            {this.renderTreeNodes(item.subs)}
          </TreeNode>
        )
      }else{
        return (
        <TreeNode {...item}  title={item.class_name} key={item.class_index} dataRef={item} />
        )
      }
    })
  }

  handleSelect = async (selectedKeys, { node }) => {
    const { feedbackStore } = this.props;
    if(feedbackStore.dateTimeStatus == 1 || feedbackStore.filterStatus) {
      feedbackStore.listenDatepicker = false;
      feedbackStore.filterStatus = false;
      feedbackStore.dateTimeStatus = '';
      feedbackStore.columns = [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '反馈词',
          dataIndex: 'dict_word'
        },
        {
          title: '标注词性',
          dataIndex: 'class_name'
        },
        {
          title: '反馈时间',
          dataIndex: 'create_time',
          render: (date) => moment(date).format("YYYY-MM-DD")
        }
      ];
      const class_name = feedbackStore.cname;
      const updateData = await feedBackList(class_name);
      const data = updateData.data.data.list;
      const total = updateData.data.data.total;
      feedbackStore.feedBackItem = data;
      feedbackStore.total = total;
    }
    if(selectedKeys.length === 0){
      return; 
    }
    if (!!!node.props.dataRef.subs  || node.props.dataRef.class_name === '所有反馈') {
      hashHistory.push(`/feedBack/${selectedKeys}/feedBack/${node.props.dataRef.class_name}`)
    }
 }

  render(){
    return(
       <div className="side-bar">
         <div className="menu-list">
           <Tree
             showLine
             onSelect={this.handleSelect}
             defaultExpandedKeys={[this.props.class_index]}
           >
             {this.renderTreeNodes(this.state.list)}
           </Tree>
         </div>
       </div>
    )
  }
}