import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import pass from "../../images/actions/pass.png"
import reject from "../../images/actions/reject.png"
import undo from "../../images/actions/undo.png"
import restore from "../../images/actions/restore.png"
import renew from "../../images/actions/renew.png"
import records from "../../images/actions/records.png"
import filter from "../../images/actions/filter.png"
import { auditPass, auditReject, updateDetailinfo, updateLogFilter, auditRevoke, auditRecovery } from '../../api'
import { Table, message } from 'antd';
import Operation from 'antd/lib/transfer/operation';
import DateTimePicker from './datetimepicker';
import moment from 'moment'

@inject('updateStore') @observer
export default class ActionBar extends Component {
    constructor () {
      super()
      this.state = {
        status: 0,//判断是驳回还是通过
        revokeArr: [],//存放撤销的id
        recoveryState: false,//判断是否执行恢复操作
        loading: true
      }
    }
  componentDidMount(){

  }

  handleUpdateColumns = () => {
    const { updateStore } = this.props;
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
    ]
  }

  handleUpdateList = async () => {
    const { updateStore } = this.props;
    const class_name = updateStore.cname;
    const pass = 0;
    const updateData = await updateDetailinfo(class_name , pass);
    const data = updateData.data.data.list;
    const total = updateData.data.data.total;
    updateStore.updateItem = data;
    updateStore.total = total;
    updateStore.current =1;
  }

  render () {
    const { updateStore } = this.props;
    const { revokeArr } = this.state;
    const menus = [
      {
        name: '通过', icon:pass, action: async () => {
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            if(updateStore.foo) {
              const index = updateStore.updateTabDetail.slice();
              const passInfo = [];//通过返回结果
              for(let i in index) {
                const res = await auditPass(index[i].toString());
                if(res.data){
                  passInfo.push(res.data.success);
                }
              }
              if(passInfo.length === 1  && passInfo.indexOf(false) == -1) {
                message.success('审核完成');
                updateStore.foo = false;
                this.handleUpdateList();
                this.setState({
                  status: 1,
                  revokeArr: index
                })
                updateStore.reState = index
              }else if(passInfo.length === 1 && passInfo.indexOf(false) != -1){
                message.error('审核失败');
              }else if(passInfo.length > 1 && passInfo.indexOf(false) == -1){
                message.success('批量审核全部成功');
                updateStore.foo = false;
                this.handleUpdateList();
                this.setState({
                  status: 1,
                  revokeArr: index
                })
                updateStore.reState = index
              }else if(passInfo.length > 1 && passInfo.indexOf(true) == -1){
                message.error('批量审核全部失败');
              }else if(passInfo.length > 1 && passInfo.indexOf(false) != -1 && passInfo.indexOf(true) != -1){
                message.error('批量审核存在失败结果');
              }
            }else{
              message.warning('请您选择想要通过的字段');
            }
          }
        }
      },
      {
        name: '驳回', icon:reject, action: async () => {
          //判断是否点击了更新日志、操作记录、筛选
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            if(updateStore.foo) {
              const index = updateStore.updateTabDetail.slice();
              const rejectInfo = [];
              for(let i in index) {
                const res = await auditReject(index[i].toString())
                if(res.data){
                  rejectInfo.push(res.data.success)
                }
              }
              if(rejectInfo.length === 1  && rejectInfo.indexOf(false) == -1) {
                message.success('驳回完成');
                updateStore.foo = false;
                this.handleUpdateList();
                this.setState({
                  status: 2,
                  revokeArr: index
                })
                updateStore.reState = index
              }else if(rejectInfo.length === 1 && rejectInfo.indexOf(false) != -1){
                  message.error('驳回失败');
              }else if(rejectInfo.length > 1 && rejectInfo.indexOf(false) == -1){
                message.success('批量驳回全部成功');
                updateStore.foo = false;
                this.handleUpdateList();
                this.setState({
                  status: 2,
                  revokeArr: index
                })
                updateStore.reState = index
              }else if(rejectInfo.length > 1 && rejectInfo.indexOf(true) == -1){
                message.error('批量驳回全部失败');
              }else if(rejectInfo.length > 1 && rejectInfo.indexOf(false) != -1 && rejectInfo.indexOf(true) != -1){
                message.error('批量驳回存在失败结果');
              }
            }else{
              message.warning('请您选择想要驳回的字段');
            }
          }
        }
      },
      {
        name: '撤销', icon:undo, action: async () => {
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            const resResults = [];//撤回结果中的success值
            const newReState = updateStore.reState.slice();
            if(newReState.length) {
              if(this.state.status == 1) {
                for(let i in newReState) {
                  const resRevoke = await auditRevoke(newReState[i].toString());
                  if(resRevoke.data){
                    resResults.push(resRevoke.data.success)
                  }
                }
                if(resResults.length) {
                  if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                    message.success('撤销通过信息成功');
                    updateStore.foo = false;
                    this.handleUpdateList();
                    this.setState((prevState, props) => {
                      prevState.recoveryState = true;
                      return prevState;
                    })
                  }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                    message.error('撤销通过信息失败');
                  }else if(resResults.length > 1 && resResults.indexOf(false) == -1) {
                    message.success('批量撤销通过信息成功');
                    updateStore.foo = false;
                    this.handleUpdateList();
                    this.setState((prevState, props) => {
                      prevState.recoveryState = true;
                      return prevState;
                    })
                  }else if (resResults.length > 1 && resResults.indexOf(true) == -1) {
                    message.error('撤销通过信息全部失败');
                  }else if (resResults.length > 1 && resResults.indexOf(false) != -1 && resResults.indexOf(true) != -1) {
                    message.warning('批量撤销通过信息存在失败结果');
                  }
                }
              }else if(this.state.status == 2) {
                for(let i in newReState) {
                  const resRevoke = await auditRevoke(newReState[i].toString());
                  if(resRevoke.data){
                    resResults.push(resRevoke.data.success)
                  }
                }
                if(resResults.length) {
                  if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                    message.success('撤销驳回信息成功');
                    updateStore.foo = false;
                    this.handleUpdateList();
                    this.setState((prevState, props) => {
                      prevState.recoveryState = true;
                      return prevState;
                    })
                  }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                    message.error('撤销驳回信息失败');
                  }else if(resResults.length > 1 && resResults.indexOf(false) == -1) {
                    message.success('批量撤销驳回信息成功');
                    updateStore.foo = false;
                    this.handleUpdateList();
                    this.setState((prevState, props) => {
                      prevState.recoveryState = true;
                      return prevState;
                    })
                  }else if (resResults.length > 1 && resResults.indexOf(true) == -1) {
                    message.error('撤销波诡信息全部失败');
                  }else if (resResults.length > 1 && resResults.indexOf(false) != -1 && resResults.indexOf(true) != -1) {
                    message.warning('批量撤销驳回信息存在失败结果');
                  }
                }
              }
            }else {
              message.warning('没有可以撤销的消息,请先执行通过或驳回操作');
            }
          }
        }
      },
      {
        name: '恢复', icon:restore, action:async () => {
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            const recovery = [];//恢复操作返回的结果值
            const newReState = updateStore.reState.slice();
            if(this.state.recoveryState) {
              for(let i in newReState) {
                const resRecovery = await auditRecovery(newReState[i].toString())
                if(resRecovery.data) {
                  recovery.push(resRecovery.data.success)
                }
              }
              if(recovery.length) {
                if(recovery.length == 1 && recovery.indexOf(false) == -1) {
                  message.success('恢复信息成功');
                  updateStore.reState = [];
                  this.handleUpdateList();
                  this.setState((prevState, props) => {
                    prevState.recoveryState = false
                    return prevState;
                  })
                }else if (recovery.length == 1 && recovery.indexOf(false) != -1){
                  message.error('恢复信息失败');
                }else if (recovery.length > 1 && recovery.indexOf(false) == -1){
                  message.success('批量恢复信息成功');
                  updateStore.reState = [];
                  this.handleUpdateList();
                  this.setState((prevState, props) => {
                    prevState.recoveryState = false
                    return prevState;
                  })
                }else if (resResults.length > 1 && resResults.indexOf(true) == -1){
                  message.error('批量恢复信息失败');
                }else if (resResults.length > 1 && resResults.indexOf(false) != -1 && resResults.indexOf(true) != -1) {
                  message.warning('批量恢复存在失败结果');
                }
              }else {
                message.warning('没有可以恢复的信息');
              }
            }else {
              message.warning('没有可以恢复的信息,请先执行撤销操作');
            }
          }
        }
      },
      {
        name: '更新日志', icon:renew, action: () => {
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            updateStore.dateTimeStatus = 1;
            updateStore.listenDatepicker = !updateStore.listenDatepicker;
            if(!updateStore.listenDatepicker) {
              this.handleUpdateList();
              this.handleUpdateColumns();
              updateStore.dateTimeStatus = '';
            }
          }
        }
      },
      {
        name: '操作记录', icon:records, action: () => {
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            updateStore.dateTimeStatus = 2;
            updateStore.listenDatepicker = !updateStore.listenDatepicker;
            if(!updateStore.listenDatepicker) {
              this.handleUpdateList();
              this.handleUpdateColumns();
              updateStore.dateTimeStatus = '';
            }
          }
        }
      },
      {
        name: '筛选', icon:filter, action:async () => {
          if(updateStore.dateTimeStatus != '') {
            updateStore.listenDatepicker = false;
            updateStore.filterStatus = false;
            updateStore.filterInfoStatus = true;
            updateStore.funStatus = '';
            updateStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleUpdateList();
          }else {
            updateStore.dateTimeStatus = 3;
            updateStore.filterStatus = !updateStore.filterStatus
            if(updateStore.filterStatus) {
              const class_name = updateStore.cname;
              const updateData = await updateLogFilter(class_name);
              const data = updateData.data.data.list;
              const total = updateData.data.data.total;
              updateStore.updateItem = data;
              updateStore.total = total;
              updateStore.current =1; 
              updateStore.columns = [{
                title: '主键',
                dataIndex: 'id'
              }, {
                title: '更新字段',
                dataIndex: 'update_field'
              }, {
                title: '更新前',
                dataIndex: 'before'
              },
              {
                  title: '编辑人员',
                  dataIndex: 'operator'
              },
              {
                title: '更新时间',
                dataIndex: 'update_time',
                render: (date) => moment(date).format("YYYY-MM-DD")
              },
              {
                title: '审核结果',
                dataIndex: 'pass',
                filters: [
                  { text: '审核中', value: '0' },
                  { text: '审核通过', value: '1' },
                  { text: '驳回', value: '2' }
                ],
                onFilter: (value, record) => {
                  return record['pass'] == value;
                },
                render(pass){
                  if(pass === 0){
                  return <span style={{color:'#3299FF'}}>审核中</span>
                  }else if(pass === 1){
                  return <span style={{color:'#1DAC00'}}>审核通过</span>
                  }else if(pass === 2){
                  return <span style={{color:'#FF0000'}}>驳回</span>
                  }
                }
              }];
            }else {
              this.handleUpdateColumns();
              this.handleUpdateList();
            }
          }
        }
      },
    ]

    const items = menus.map(item => (
      <div 
        className="menu-item" 
        key={item.name} 
        onClick={item.action}>
        <div className="menu-item-image" style={{background:'url('+item.icon+')'+'no-repeat',backgroundSize:'20px'+' '+'20px'}}></div>
        <span className="menu-item-span">{item.name}</span>
      </div>
    ))
    return (
      <div className='action-container'>
        <div className="action-bar">
          {items}
        </div>
        {updateStore.listenDatepicker && <DateTimePicker/>}
      </div>
    )
  }
}