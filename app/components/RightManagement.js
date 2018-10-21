import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import "../css/rightManagement.css"
import AbcHeader from "./common/header"
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import { grantManagementList,grantAction,deleteRole } from '../api'
import { Modal,Input,message} from 'antd'
import { observer, inject } from 'mobx-react'

@inject('listStore') @observer
class RightManagement extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      status:''
    }
  }
  async componentDidMount(){
    const [ grantData ] =  await Promise.all([grantManagementList()])
    // console.log(grantData.data.data.list);
    if(!grantData){
       message.warning("您没有权限查看管理员列表")
    }else{
       this.setState({
          data:grantData.data.data.list
       })
    }
  }
  addManagement = () => {
    const {listStore} = this.props;
    listStore.isShowRightModal = true;
  }
  handleOk = async () =>{
    const {listStore} = this.props;
    //请求接口
    let inputValue = document.getElementById('inputValue').value;//邮箱
    let status = this.state.status;//管理员权限
    if(!inputValue.trim().length){
      message.warning('您输入的邮箱长度不可为空');
      return false;
    } 
    if(!status.trim().length){
      message.warning('您还未选择管理员权限')
      return false;
    }
    if(inputValue.trim().length && status.trim().length){
      //发起请求
      const response =  await grantAction(inputValue,status);
      if(!response){
        message.error('添加管理失败,该账号不存在');
        // listStore.isShowRightModal = false;
      }else if(response.data.success){
        listStore.isShowRightModal = false;
        message.success('添加管理员成功');
        //刷新页面请求接口
        const res = await grantManagementList();
        if(!res){
          message.warning("您没有权限查看管理员列表")
        }else{
          this.setState({
             data:res.data.data.list
          })
        }
        
      }
    }
  }
  handleCancel = () =>{
    const {listStore} = this.props;
    listStore.isShowRightModal = false;
  }
  handleChange(e){
    // console.log(e.target.value);
    this.setState({
      status:e.target.value
    })
  }
  handleDelete = (fake_email) => {
    // console.log(fake_email);
    Modal.confirm({
      title: '您是否确认要删除该管理员权限？',
      okText:'确认',
      cancelText:'取消',
      onOk: async () => {
       const res  =  await deleteRole(fake_email);
      //  console.log(res);
      if(!res){
         message.error('删除该管理员权限失败');
      }else if(res.data.success){
         message.success('删除该管理员权限成功');
          //刷新页面请求接口
        const response = await grantManagementList();
        if(!response){
          message.warning("您没有权限查看管理员列表")
        }else{
          this.setState({
            data:response.data.data.list
          })
        }
       }
      }
    })
  }

  handleKeyUp = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      this.handleOk();
    }
  }

  render() {
    //赋值this
    var self = this; 
    const columns = [
      {
        title: '头 像',
        dataIndex: 'id',
        render:function(){
          return <div className="headImage"></div>
        }
      }, 
      {
        title: '管 理 员 名 称',
        dataIndex: 'username'
      }, 
      {
        title: '邮 箱',
        dataIndex: 'email',
      },
      {
        title: '职 位',
        dataIndex: 'role'
      },
      {
        title: '权 限',
        dataIndex: 'auth',
        render:function(pass){
          if(pass === 'read'){
            return <span className="_span">只 读</span>
          }else if(pass === 'edit'){
            return <span className="_span">编 辑</span>
          }else if(pass === 'create'){
            return <span className="_span">创 建</span>
          }else if(pass === 'delete'){
            return <span className="_span">删 除</span>
          }
        }
      },
      {
        title: '删 除',
        dataIndex: 'fake_email',
        render:function(fake_email){
          return <span className="delete_span"  onClick={self.handleDelete.bind(self,fake_email)}>删 除</span>
        }
      }
    ]
    const {listStore} = this.props;
    const isVisible = listStore.isShowRightModal;
    return (
      <div className="demandList">
        {/*头部tab栏内容*/}
        <AbcHeader {...this.props} />
        {/*导航栏部分*/}
        <div className="search">
          <div className="left">管理员权限管理:</div>
          <div className="right" onClick = {this.addManagement}>添加管理员</div>
        </div>
        {/*列表部分*/}
        <div className="list">
          <Table 
            dataSource={this.state.data} 
            columns={columns} 
            rowKey="id" 
            pagination={true}
          />
          <Modal
           title="添加管理员"
           visible={isVisible}
           okText={'确认添加'}
           cancelText={'取消'}
           onOk={this.handleOk}
           onCancel={this.handleCancel}
          >
           <div className="managementContainer" style={{ width: 285, height: 140 }}>
            <div className="inputBox">
               {/* <img src="./images/message.png"/> */}
               <Input placeholder="请输入要添加的管理员邮箱"
                      size="default" 
                      id="inputValue"
                      className='inputValue'
                      onKeyUp={this.handleKeyUp}
                      style={{height:'40px'}}
                />
            </div>
            <div className="contentBox" 
                style={{fontSize:'16px',marginTop:'40px',height:'40px',lineHeight:'40px',borderBottom:'1px solid #e6e6e6'}}>
              管理员权限
              &nbsp;&nbsp;&nbsp;&nbsp;
              <label><input type="radio" name="radio"  value="edit" style={{verticalAlign:'middle',marginTop:'-1px'}} onChange={(event) => {this.handleChange(event)}}/>&nbsp;编辑&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <label><input type="radio" name="radio"  value="read" style={{verticalAlign:'middle',marginTop:'-1px'}} onChange={(event) => {this.handleChange(event)}}/>&nbsp;只读</label>
            </div>
           </div>
          </Modal>
        </div>
      </div>
    )
  }
}
export default RightManagement
