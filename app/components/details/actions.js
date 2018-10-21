import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import save from "../../images/actions/save.png"
import upload from "../../images/actions/load.png"
import undo from "../../images/actions/undo.png"
import restore from "../../images/actions/restore.png"
import deleted from "../../images/actions/delete.png"
import insert from "../../images/actions/insert.png"
import renew from "../../images/actions/renew.png"
import records from "../../images/actions/records.png"
import {getMenuDetails,insertWord,updateWord,deleteWord,editUndo,editRedo} from '../../api'
import {Button, DatePicker, Modal, Upload,message} from 'antd';
import Mymodal from './upload'
import DateTimePicker from './datetimepicker'
import ListStore from '../../stores/listStore';
import moment from 'moment'
import '../../css/action.css'
//引入相应的Store
@inject('listStore' ,'detailStore') @observer
class ActionBar extends Component {
    constructor (props) {
      super(props)
      this.state = {
          status:0,
          deleteId: '',
          editId: '',
          condition:0,
          readonlyStatus:0
       }
    }
  componentDidMount(){
     
  }

//更新或操作之后 点击其他功能展示list列表页
  handleClick = async () => {
    const {listStore} = this.props;
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
  }
//执行操作后 重新请求页面数据
  handleClickOperation = async () => {
    const { listStore } = this.props
    const id = listStore.id;
    const cname = listStore.cname;
    const detailsData = await getMenuDetails(cname, id);
    const data = detailsData.data.data.list;
    const total = detailsData.data.data.total;
    listStore.listItems = data; //列表页数据
    listStore.total = total;
    listStore.current = 1;
    listStore.listFirstInfo = {
      cname: cname,
      cid: id,
      dict_word: data[0] && data[0].dict_word
    }
    this.handleTitile();
  }

  handleTitile = () => {
    const col = document.getElementsByTagName('td');
    for(let i in col) {
      if(col[i].innerText) {
        col[i].setAttribute('title',col[i].innerText.toString())          
      }
    }
  }

  render () {
    const { detailStore, listStore } = this.props;
    const menus = [
      {
        name: '保存',  icon:save, action:async () => {
          if(listStore.state != '') {
            listStore.isShowDetail = true;
            listStore.listenDatepicker = false;
            listStore.funStatus = '';
            this.handleClick();
            this.handleClickOperation();
            listStore.state = '';
          }else {
            if(detailStore.status === 1){
              //插入的保存
              const temp = {};
              for (let key in detailStore.head) {
                //处理成英文的key
                temp[key] = detailStore.postData[detailStore.head[key]]
              }
               //赋值当前的更新时间和创建时间
              temp.create_time = detailStore.create_time;
              temp.update_time = detailStore.update_time;
              temp.class_index = detailStore.classIndex;
              temp.class_name = detailStore.className; 
              temp.status = detailStore.infoStatus;
              if(!temp.class_index){
                return layer.msg('词性索引不可以为空');
              }
              if(!temp.class_name){
                return layer.msg('词性定义不可以为空');
              }
              if(!temp.dict_word){
                return layer.msg('主词不可以为空');
              }
              if(!temp.id){
                return layer.msg('词库字库id不可以为空');
              }
              var resp = await insertWord(temp);
              if(!resp){
                message.warning('保存失败,请输入词条详情的相关信息')
              }else if(resp.data.success){
                this.setState({
                  status:1,
                  editId: temp.id
                })//保存成功status为1
                detailStore.status = 0;//变为只读状态
                //重新渲染数据
                let title = document.getElementById("info-title");
                ReactDOM.findDOMNode(title).innerHTML = '词 条 详 情';
                this.handleClickOperation();
                listStore.insertStatus = '';
                return layer.msg("保存成功");
              }else if(!resp.data.success && resp.data.status === 0){
                return layer.msg("操作失败，数据库中没有该词性索引所对应的表");
              }
            }else if(detailStore.status === 2){
              //双击的保存
              const listInfo = detailStore.updateInfo;
              listInfo.create_time = detailStore.create_time;
              listInfo.update_time = detailStore.update_time;
              if(listInfo.class_index != detailStore.classIndex) {
                message.warning('词性索引不可修改，将以修改前的数据提交');
                return false;
              }else if(listInfo.class_name != detailStore.className) {
                message.warning('词性定义不可修改，将以修改前的数据提交');
                return false;
              }
              const saveInfo = await updateWord(listInfo);
              if(!saveInfo) {
                message.error('保存失败请重新进行修改操作');
              }else if(saveInfo.data.success) {
                message.success('保存成功');
                detailStore.status = 0;
                this.handleClickOperation();
              }
            }else{
               message.info("请点击插入增加数据或者双击修改词条详情");
            }
          }
        }
      },
      {
          name: '上传', icon:upload, action:async  () => {   
            if(listStore.state != '') {
              listStore.isShowDetail = true;
              listStore.listenDatepicker = false;
              listStore.funStatus = '';
              this.handleClick();
              this.handleClickOperation();
              listStore.state = '';
            }
            listStore.isShowModal = true;
          }
      },
      {
          name: '撤销', icon:undo, action:  () => {
            if(listStore.state != '') {
              listStore.isShowDetail = true;
              listStore.listenDatepicker = false;
              listStore.funStatus = '';
              this.handleClick()
              this.handleClickOperation();
              listStore.state = '';
            }else {
              if(this.state.status === 0){
                message.info('请对数据进行操作，之后再执行撤销操作')
              }else if(this.state.status === 1){
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销保存么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    const { editId } = this.state;
                    if(editId) {
                      const res = await editUndo({id:editId, operation:'edit'})
                      if(res.data.success) {
                        localStorage.setItem('edit',editId);
                        this.handleClickOperation();
                        this.setState({
                          editId: '',
                          condition:1
                        })
                      }
                    }else {
                      message.info('没有可以撤销的信息');
                    }
                  },
                  onCancel:() => {
    
                  }
                })
              }else if(this.state.status === 2){
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认撤销删除么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () =>{
                    const { deleteId } = this.state;
                    if(deleteId) {
                      const res = await editUndo({id:deleteId, operation:'delete'});
                      if(res.data.success) {
                        localStorage.setItem('delete',deleteId);
                        this.handleClickOperation();
                        this.setState({
                          deleteId: '',
                          condition:2
                        })
                      }
                    }else {
                      message.info('没有可以撤销的信息');
                    }
                  },
                  onCancel:() => {
    
                  }
                })
              }
            }
            
          }
      },
      {
          name: '恢复', icon:restore, action:  () => {
            if(listStore.state != '') {
              listStore.isShowDetail = true;
              listStore.listenDatepicker = false;
              listStore.funStatus = '';
              this.handleClick();
              this.handleClickOperation();
              listStore.state = '';
            }else {
              if( this.state.condition == 0 ) {
                 message.info('请先执行撤销操作');
              }else if(this.state.condition == 1){
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认恢复至撤销前保存的操作么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    const editId = localStorage.getItem('edit');
                    if(editId) {
                      const res = await editRedo({id: editId, operation: 'delete'});
                      if(res.data.success) {
                        this.handleClickOperation();
                        localStorage.removeItem('edit');
                      }
                    }else {
                      message.info('没有可以恢复的信息');
                    }
                  },
                  onCancel:() => {
    
                  }
                })
              }else if(this.state.condition == 2) {
                Modal.confirm({
                  confirmLoading:true,
                  title:'确认恢复至撤销前删除的操作么？',
                  okText:'确认',
                  cancelText:'取消',
                  onOk:async () => {
                    const deleteId = localStorage.getItem('delete');
                    if(deleteId) {
                      const res = await editRedo({id: deleteId, operation: 'delete'});
                      if(res.data.success) {
                       this.handleClickOperation();
                        localStorage.removeItem('delete');
                      }
                    }else {
                      message.info('没有可以恢复的信息');
                    }
                  },
                  onCancel:() => {
    
                  }
                })
              }
            }    
          }
      },
      {
          name: '删除', icon:deleted, action:async () => {
          if(listStore.state != '') {
            listStore.isShowDetail = true;
            listStore.listenDatepicker = false;
            listStore.funStatus = '';
            this.handleClick();
            this.handleClickOperation();
            listStore.state = '';
          }else {
            const data = detailStore.selectedItem;
            const response = await deleteWord(data);
            if(response.data.success){
              const deleteId = listStore.selectedItem.id;
              this.setState({
                status:2,
                deleteId: deleteId
              })
              this.handleClickOperation();
              message.success("您已成功删除该条数据");
            }else {
              message.error('删除出错,请重新操作');
            }
          }
        }
      },
      {
          name: '插入', icon:insert, action:() => {     
            if(listStore.state != '') {
              listStore.isShowDetail = true;
              listStore.listenDatepicker = false;
              listStore.funStatus = '';
              this.handleClick();
              this.handleClickOperation();
              listStore.state = '';
            }else {
              if(detailStore.showDetailTitle){
                listStore.insertStatus = 1;
                let title = document.getElementById("info-title");
                ReactDOM.findDOMNode(title).innerHTML = '输 入 词 条';
                detailStore.status = 1;//改变readOnly为false状态
                this.setState({
                  readonlyStatus:detailStore.status
                })
                const dataInfo = detailStore.data;//将详情页的value置空
                for(let i in dataInfo){
                  dataInfo[i] = '';
                }
                document.getElementById("info-input").focus();
              }else{
                message.info('词条详情信息不存在，请切换数据');
              }
            }
        }
      },
      {
        name: '更新日志', icon:renew, action:async () => {
          listStore.state = 1;
          listStore.isShowDetail = !listStore.isShowDetail;
          listStore.listenDatepicker = !listStore.listenDatepicker;
          if(listStore.isShowDetail) {
            this.handleClick();
            this.handleClickOperation();
          }
        }
      },
      {
        name: '操作记录', icon:records, action:async () => {
          listStore.state = 2;
          listStore.isShowDetail = !listStore.isShowDetail;
          listStore.listenDatepicker = !listStore.listenDatepicker;
          if(listStore.isShowDetail) {
            this.handleClick();
            this.handleClickOperation();
          }
        }
      },
    ]

    const items = menus.map((item) => (
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
      <Mymodal/>
      {listStore.listenDatepicker && <DateTimePicker/>}
      </div>
    )
  }
}

export default ActionBar