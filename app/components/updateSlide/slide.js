import React, { Component } from "react"
import { Link, hashHistory } from "react-router"
import {withRouter} from 'react-router-dom' ;
import { Tree } from 'antd';
import { updateSlide, updateDetailinfo } from '../../api'
import { observer, inject } from 'mobx-react'
import moment from 'moment'


const TreeNode = Tree.TreeNode;

@inject('updateStore') @observer
class Slider extends Component{
   constructor(props){
       super(props);
       this.state = {
          list: []
       }
   }

   async componentDidMount(){
      const [ TreeMenus ] = await Promise.all([updateSlide()]);
      const menu = this.getDeepestItem(TreeMenus.data.data.filter(item => item.id == this.props.id))
      await this.setState((prevState, props) => {
        prevState.list = TreeMenus.data.data;
        return prevState;
      })
      // console.log(menu);
      menu && hashHistory.push(`/update/${menu.class_index}/updates/${menu.class_name}`)
   }
   getDeepestItem = (arr) => {
    if (arr.length && arr[0].subs) {
       return arr[0];
    }
  }
  componentDidUpdate(prevProps, prevState){
         
  }
   handleSelect = async (selectedKeys, { node }) => {
    const { updateStore } = this.props;
    if(updateStore.dateTimeStatus != '' || updateStore.filterStatus) {
      updateStore.listenDatepicker = false;
      updateStore.filterStatus = false;
      updateStore.dateTimeStatus = '';
      updateStore.columns = [
        {
          title: '词性',
          dataIndex: 'class_name'
        },
        {
          title: '操作记录的id',
          dataIndex: 'id',
        },
        {
          title: '更新字段',
          dataIndex: 'update_field',
        },
        {
          title: '更新前',
          dataIndex: 'before'
        },
        {
          title: '更新后',
          dataIndex: 'after'
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          render: (date) => moment(date).format("YYYY-MM-DD")
        }
      ];
      const class_name = updateStore.cname;
      const pass = 0;
      const updateData = await updateDetailinfo(class_name, pass);
      const data = updateData.data.data.list;
      const total = updateData.data.data.total;
      updateStore.updateItem = data;
      updateStore.total = total;
    }
    if(selectedKeys.length === 0){
       return; 
    }
    if (!!!node.props.dataRef.subs || node.props.dataRef.class_name === '所有更新') {
       hashHistory.push(`/update/${selectedKeys}/updates/${node.props.dataRef.class_name}`)
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
export default Slider