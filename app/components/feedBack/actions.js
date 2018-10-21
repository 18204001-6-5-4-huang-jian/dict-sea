import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import add_synonym from "../../images/actions/add_synonym.png"
import add_key from "../../images/actions/add_key.png"
import pass from "../../images/actions/pass.png"
import reject from "../../images/actions/reject.png"
import undo from "../../images/actions/undo.png"
import restore from "../../images/actions/restore.png"
import deleted from "../../images/actions/delete.png"
import records from "../../images/actions/records.png"
import filter from "../../images/actions/filter.png"
import '../../css/action.css'
import moment from 'moment'
import { Table, message, Modal } from 'antd';
import { feedBackList, operateRes, feedBackUndo, feedBackRedo, feedBackDelete, updateLogFilter } from '../../api'
import AddPrimary from './addPrimary'
import AddSynonym from './addSynonym'
import DateTimePicker from './datetimepicker';

@inject('feedbackStore') @observer
export default class ActionBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      adminStatus: 0
    }
  }

  handleUpdateColumns = () => {
    const { feedbackStore } = this.props;
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
  }

  handleFeedBackList = async () => {
    const { feedbackStore } = this.props;
    const class_name = feedbackStore.cname;
    const updateData = await feedBackList(class_name);
    const data = updateData.data.data.list;
    const total = updateData.data.data.total;
    feedbackStore.feedBackItem = data;
    feedbackStore.total = total;
    feedbackStore.current =1;
  }

  render() {
    const { feedbackStore } = this.props;
    const menus = [
      {
        name: '添加同义词',  icon:add_synonym, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.foo) {
              if(feedbackStore.feedBackDetail.length > 1){
                message.success('请逐个添加同义词');
              }else {
                feedbackStore.modalSynonymStatus = !feedbackStore.modalSynonymStatus
              }
            }else {
              message.warning('请您选择想要添加同义词的字段');
            }
          }
        }
      },
      {
        name: '添加主键',  icon:add_key, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.foo) {
              if(feedbackStore.feedBackDetail.length > 1){
                message.success('请逐个添加主键');
              }else {
                feedbackStore.modalPrimaryStatus = !feedbackStore.modalPrimaryStatus
              }
            }else {
              message.warning('请您选择想要添加为主键的字段');
            }
          }
        }
      },
      {
        name: '通过',  icon:pass, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.foo) {
              const index = feedbackStore.feedBackDetail.slice();
              const passInfo = [];//通过返回结果
              for(let i in index) {
                const res = await operateRes({id: index[i].toString(), pass: 'true'});
                console.log(res)
                if(!res) {
                  this.setState({
                    adminStatus: 1
                  })
                }else if(res.data){
                  passInfo.push(res.data.success);
                }
              }
              if(this.state.adminStatus == 1) {
                layer.msg('对不起,您没有编辑权限。');
                return ;
              }else {
                if(passInfo.length === 1  && passInfo.indexOf(false) == -1) {
                  message.success('通过完成');
                  feedbackStore.foo = false;
                  this.handleFeedBackList();
                  feedbackStore.revokeArr = index;
                  feedbackStore.recoveryArr = index;
                  feedbackStore.operateStatus = 1;
                }else if(passInfo.length === 1 && passInfo.indexOf(false) != -1){
                  message.error('通过失败,找不到标注词性的词性类别');
                }else if(passInfo.length > 1 && passInfo.indexOf(false) == -1){
                  message.success('批量通过全部成功');
                  feedbackStore.foo = false;
                  this.handleFeedBackList();
                  feedbackStore.revokeArr = index;
                  feedbackStore.recoveryArr = index;
                  feedbackStore.operateStatus = 1;
                }else if(passInfo.length > 1 && passInfo.indexOf(true) == -1){
                  message.error('批量通过全部失败,找不到标注词性的词性类别');
                }else if(passInfo.length > 1 && passInfo.indexOf(false) != -1 && passInfo.indexOf(true) != -1){
                  message.error('批量通过存在失败结果');
                }
              }
            }else {
              message.warning('请您选择想要通过的字段');
            }
          }
        }
      },
      {
        name: '驳回',  icon:reject, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.foo) {
              const index = feedbackStore.feedBackDetail.slice();
              const rejectInfo = [];//驳回的结果
              for(let i in index) {
                const res = await operateRes({id: index[i].toString(), pass: 'false'})
                if(!res) {
                  this.setState({
                    adminStatus: 1
                  })
                }else if(res.data){
                  rejectInfo.push(res.data.success)
                }
              }
              if(this.state.adminStatus == 1) {
                layer.msg('对不起,您没有编辑权限。');
                return ;
              }else {
                if(rejectInfo.length === 1  && rejectInfo.indexOf(false) == -1) {
                  message.success('驳回完成');
                  feedbackStore.foo = false;
                  this.handleFeedBackList();
                  feedbackStore.revokeArr = index;
                  feedbackStore.recoveryArr = index;
                  feedbackStore.operateStatus = 2;
                }else if(rejectInfo.length === 1 && rejectInfo.indexOf(false) != -1){
                    message.error('驳回失败,找不到标注词性的词性类别');
                }else if(rejectInfo.length > 1 && rejectInfo.indexOf(false) == -1){
                  message.success('批量驳回全部成功');
                  feedbackStore.foo = false;
                  this.handleFeedBackList();
                  feedbackStore.revokeArr = index;
                  feedbackStore.recoveryArr = index;
                  feedbackStore.operateStatus = 2;
                }else if(rejectInfo.length > 1 && rejectInfo.indexOf(true) == -1){
                  message.error('批量驳回全部失败,找不到标注词性的词性类别');
                }else if(rejectInfo.length > 1 && rejectInfo.indexOf(false) != -1 && rejectInfo.indexOf(true) != -1){
                  message.error('批量驳回存在失败结果');
                }
              }
            }else {
              message.warning('请您选择想要驳回的字段');
            }
          }
          
        }
      },
      {
        name: '撤销',  icon:undo, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.funStatus = '';
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.operateStatus != 0){
              const resResults = [];//存放撤销结果
              const revokeArr = feedbackStore.revokeArr.slice();
              if(feedbackStore.operateStatus == 1) {
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销通过么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    for(let i in revokeArr) {
                      const resRevoke = await feedBackUndo({id: revokeArr[i]})
                      if(resRevoke.data){
                        resResults.push(resRevoke.data.success)
                      }
                    }
                    if(resResults.length) {
                      if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                        message.success('撤销通过信息成功');
                        this.handleFeedBackList();
                        feedbackStore.foo = false;
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.operateStatus = 0;
                      }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                        message.error('撤销通过信息失败');
                      }if(resResults.length > 1 && resResults.indexOf(false) == -1) {
                        message.success('批量撤销通过信息成功');
                        this.handleFeedBackList();
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.foo = false;
                        feedbackStore.operateStatus = 0;
                      }else if (resResults.length > 1 && resResults.indexOf(true) == -1) {
                        message.error('撤销通过信息全部失败');
                      }else if (resResults.length > 1 && resResults.indexOf(false) != -1 && resResults.indexOf(true) != -1) {
                        message.warning('批量撤销通过信息存在失败结果');
                      }
                    }else {
                      message.error('撤销失败');
                    }
                  },
                  onCancel:() => {
          
                  }
                })
              }else if(feedbackStore.operateStatus == 2) {
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销驳回么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    for(let i in revokeArr) {
                      const resRevoke = await feedBackUndo({id: revokeArr[i]})
                      if(resRevoke.data){
                        resResults.push(resRevoke.data.success)
                      }
                    }
                    if(resResults.length) {
                      if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                        message.success('撤销驳回信息成功');
                        this.handleFeedBackList();
                        feedbackStore.foo = false;
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.operateStatus = 0;
                      }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                        message.error('撤销驳回信息失败');
                      }if(resResults.length > 1 && resResults.indexOf(false) == -1) {
                        message.success('批量撤销驳回信息成功');
                        this.handleFeedBackList();
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.foo = false;
                        feedbackStore.operateStatus = 0;
                      }else if (resResults.length > 1 && resResults.indexOf(true) == -1) {
                        message.error('撤销驳回信息全部失败');
                      }else if (resResults.length > 1 && resResults.indexOf(false) != -1 && resResults.indexOf(true) != -1) {
                        message.warning('批量撤销驳回信息存在失败结果');
                      }
                    }else {
                      message.error('撤销失败');
                    }
                  },
                  onCancel:() => {
          
                  }
                })
              }else if(feedbackStore.operateStatus == 3) {
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销删除么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    for(let i in revokeArr) {
                      const resRevoke = await feedBackUndo({id: revokeArr[i]})
                      if(resRevoke.data){
                        resResults.push(resRevoke.data.success)
                      }
                    }
                    if(resResults.length) {
                      if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                        message.success('撤销删除信息成功');
                        this.handleFeedBackList();
                        feedbackStore.foo = false;
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.operateStatus = 0;
                      }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                        message.error('撤销删除信息失败');
                      }if(resResults.length > 1 && resResults.indexOf(false) == -1) {
                        message.success('批量撤销删除信息成功');
                        this.handleFeedBackList();
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.foo = false;
                        feedbackStore.operateStatus = 0;
                      }else if (resResults.length > 1 && resResults.indexOf(true) == -1) {
                        message.error('撤销删除信息全部失败');
                      }else if (resResults.length > 1 && resResults.indexOf(false) != -1 && resResults.indexOf(true) != -1) {
                        message.warning('批量撤销删除信息存在失败结果');
                      }
                    }else {
                      message.error('撤销失败');
                    }
                  },
                  onCancel:() => {
          
                  }
                })
              }else if(feedbackStore.operateStatus == 4) {
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销添加主键么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    for(let i in revokeArr) {
                      const resRevoke = await feedBackUndo({id: revokeArr[i]})
                      if(resRevoke.data){
                        resResults.push(resRevoke.data.success)
                      }
                    }
                    if(resResults.length) {
                      if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                        message.success('撤销添加主键成功');
                        this.handleFeedBackList();
                        feedbackStore.foo = false;
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.operateStatus = 0;
                      }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                        message.error('撤销添加主键失败');
                      }
                    }else {
                      message.error('撤销失败');
                    }
                  },
                  onCancel:() => {
          
                  }
                })
              }else if(feedbackStore.operateStatus == 5) {
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销添加同义词么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    for(let i in revokeArr) {
                      const resRevoke = await feedBackUndo({id: revokeArr[i]})
                      if(resRevoke.data){
                        resResults.push(resRevoke.data.success)
                      }
                    }
                    if(resResults.length) {
                      if(resResults.length = 1 && resResults.indexOf(false) == -1) {
                        message.success('撤销添加同义词成功');
                        this.handleFeedBackList();
                        feedbackStore.foo = false;
                        feedbackStore.recoveryStatus = true;
                        feedbackStore.operateStatus = 0;
                      }else if(resResults.length = 1 && resResults.indexOf(false) != -1){
                        message.error('撤销添加同义词失败');
                      }
                    }else {
                      message.error('撤销失败');
                    }
                  },
                  onCancel:() => {
          
                  }
                })
              }
            }else {
              message.warning('没有可以撤销的信息，请先执行信息的相关操作');
            }
          }
          
        }
      },
      {
        name: '恢复',  icon:restore, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.funStatus = '';
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.recoveryStatus) {
              const resRecovery = [];//恢复操作的结果
              const recoveryArr = feedbackStore.recoveryArr.slice();
              Modal.confirm({
                confirmLoading:true,
                title:'确认恢复至撤销前的操作么？',
                okText:'确认',
                cancelText:'取消',
                onOk:async () => {
                  for(let i in recoveryArr) {
                    const recovery = await feedBackRedo({id: recoveryArr[i]})
                    if(recovery.data) {
                      resRecovery.push(recovery.data.success);
                    }
                  }
                  if(resRecovery.length) {
                    if(resRecovery.length == 1 && resRecovery.indexOf(false) == -1) {
                      message.success('恢复撤销操作成功');
                      this.handleFeedBackList();
                      feedbackStore.foo = false;
                      feedbackStore.recoveryStatus = false;
                      feedbackStore.recoveryArr = [];
                    }else if(resRecovery.length == 1 && resRecovery.indexOf(false) != -1) {
                      message.error('恢复撤销操作失败');
                    }else if(resResults.length > 1 && resResults.indexOf(false) == -1){
                      message.success('恢复撤销操作全部成功');
                      this.handleFeedBackList();
                      feedbackStore.foo = false;
                      feedbackStore.recoveryStatus = false;
                      feedbackStore.recoveryArr = [];
                    }else if (resRecovery.length > 1 && resRecovery.indexOf(true) == -1) {
                      message.error('恢复撤销信息全部失败');
                    }else if (resRecovery.length > 1 && resRecovery.indexOf(false) != -1 && resRecovery.indexOf(true) != -1) {
                      message.warning('批量恢复撤销信息存在失败结果');
                    }
                  }else {
                    message.error('恢复失败');
                  }
                },
                onCancel:() => {

                }
              })
            }else {
              message.warning('没有可恢复的信息,请先执行撤销操作');
            }
          }
          
        }
      },
      {
        name: '删除',  icon:deleted, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.funStatus = '';
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            if(feedbackStore.foo) {
              const index = feedbackStore.feedBackDetail.slice();
              const deletedInfo = [];//删除结果
              for(let i in index) {
                const res = await feedBackDelete({id: index[i]})
                if(res.data){
                  deletedInfo.push(res.data.success)
                }
              }
              if(deletedInfo.length) {
                if(deletedInfo.length === 1  && deletedInfo.indexOf(false) == -1) {
                  message.success('删除完成');
                  this.handleFeedBackList();
                  feedbackStore.revokeArr = index;
                  feedbackStore.recoveryArr = index;
                  feedbackStore.foo = false;
                  feedbackStore.operateStatus = 3;
                }else if(deletedInfo.length === 1 && deletedInfo.indexOf(false) != -1){
                    message.error('删除失败');
                }else if(deletedInfo.length > 1 && deletedInfo.indexOf(false) == -1){
                  message.success('批量删除全部成功');
                  this.handleFeedBackList();
                  feedbackStore.revokeArr = index;
                  feedbackStore.recoveryArr = index;
                  feedbackStore.foo = false;
                  feedbackStore.operateStatus = 3;
                }else if(deletedInfo.length > 1 && deletedInfo.indexOf(true) == -1){
                  message.error('批量删除全部失败');
                }else if(deletedInfo.length > 1 && deletedInfo.indexOf(false) != -1 && deletedInfo.indexOf(true) != -1){
                  message.error('批量删除存在失败结果');
                }
              }else {
                message.error('删除失败');
              }
            }else {
              message.warning('请您选择想要删除的字段');
            }
          }
          
        }
      },
      {
        name: '操作记录',  icon:records, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.funStatus = '';
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            feedbackStore.dateTimeStatus = 1;
            feedbackStore.listenDatepicker = !feedbackStore.listenDatepicker;
            if(!feedbackStore.listenDatepicker) {
              this.handleUpdateColumns();
              this.handleFeedBackList();
              feedbackStore.dateTimeStatus = '';
            }
          }
        }
      },
      {
        name: '筛选',  icon:filter, action:async () => {
          if(feedbackStore.dateTimeStatus != '') {
            feedbackStore.listenDatepicker = false;
            feedbackStore.filterStatus = false;
            feedbackStore.filterInfoStatus = true;
            feedbackStore.funStatus = '';
            feedbackStore.dateTimeStatus = '';
            this.handleUpdateColumns();
            this.handleFeedBackList();
          }else {
            feedbackStore.dateTimeStatus = 2;
            feedbackStore.filterStatus = !feedbackStore.filterStatus
            if(feedbackStore.filterStatus) {
              const class_name = feedbackStore.cname;
              const updateData = await updateLogFilter(class_name);
              const data = updateData.data.data.list;
              const total = updateData.data.data.total;
              feedbackStore.feedBackItem = data;
              feedbackStore.total = total;
              feedbackStore.current = 1;
              feedbackStore.columns = [{
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
              this.handleFeedBackList();
            }
          }
        }
      }
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
      <div className ="action-container">
        <div className="action-bar">
          {items}
        </div>
        {feedbackStore.listenDatepicker && <DateTimePicker/>}
        {feedbackStore.modalPrimaryStatus && <AddPrimary />}
        {feedbackStore.modalSynonymStatus && <AddSynonym />}
      </div>
    )
  }
}