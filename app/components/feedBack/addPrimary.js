import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { Table, message, Modal } from 'antd';
import { feedBackList, selectClass, addPrimary } from '../../api'

@inject('feedbackStore') @observer
export default class AddPrimary extends Component{
  constructor(props) {
    super(props) 
    this.state = {
      inputValue: '',
      feedBackSelect: [],
      clickNum:0
    }
  }

  handleFeedBackList = async () => {
    const { feedbackStore } = this.props;
    const class_name = feedbackStore.cname;
    const updateData = await feedBackList(class_name);
    const data = updateData.data.data.list;
    const total = updateData.data.data.total;
    feedbackStore.feedBackItem = data;
    feedbackStore.total = total;
    feedbackStore.current = 1;
  }

  handleSelectClick = async () => {
    const { feedbackStore } = this.props;
    const selectedRows = feedbackStore.selectedRows;
    const inputValue = selectedRows[0].class_name;
    if(inputValue) {
      const res = await selectClass(inputValue);
      const data = res.data.data;
      if(res.data.data.length != 0) {
        this.setState({
          feedBackSelect: data
        })
      }else if(res.data.data.length == 0) {
        layer.msg('没有对应的结果');
      }
    }else if(inputValue == '') {
      layer.msg('搜索不能为空，请填写要搜索的词性')
    }
  }

  handleClickLi = (params) => {
    var name = params[0]
    var index = params[1]
    this.setState({
      inputValue: name,
      clickNum:index
    })
    layer.msg('您选择了主键：'+name);
  }

  handleOk = async () => {
    const { feedbackStore } = this.props;
    if(this.state.inputValue == '') {
      layer.msg('请选择想要添加的主键');
    }else {
      const class_name = feedbackStore.selectedRows[0].class_name;
      feedbackStore.selectedRows[0].class_name = this.state.inputValue;
      const data = feedbackStore.selectedRows[0];
      const res = await addPrimary(data);
      feedbackStore.modalPrimaryStatus = false;
      if(res.data.success) {
        const addPrimaryArr = []
        message.success('添加主键成功');
        this.handleFeedBackList();
        feedbackStore.foo = false;
        addPrimaryArr.push(data.id);
        feedbackStore.operateStatus = 4;
        feedbackStore.revokeArr = addPrimaryArr;
        feedbackStore.recoveryArr = addPrimaryArr;
      }else {
        feedbackStore.modalPrimaryStatus = false;
        feedbackStore.selectedRows[0].class_name = class_name;
        this.handleFeedBackList();
        message.error('添加主键失败,请重新操作');
      }
    }
  }

  handleCancel = (e) => {
    const { feedbackStore } = this.props;
    feedbackStore.modalPrimaryStatus = false;
  }
  
  render() {
    const { feedbackStore } = this.props;
    const { feedBackSelect } = this.state;
    const selectedRows = feedbackStore.selectedRows;
    const info = feedBackSelect.map((item, index) => {
      var params = [item,index]
      return <li className={this.state.clickNum == index ? "selectedLi" : "selectLi"} key={index} onClick = {() => {this.handleClickLi(params)}}>{item}</li>
    })

    return (
      <div>
        <Modal title="搜索词性" 
          visible={feedbackStore.modalPrimaryStatus}
          onOk={this.handleOk} 
          onCancel={this.handleCancel}
          okText={'添加为主键'}
          cancelText={'取消'}
        >
          <div className='modalImport'>
            <img className = 'modalSelect' src="../../images/preview7.png" />
            <input className = 'modalInput' value={selectedRows[0].class_name} readOnly/>
            <div className = 'modalInfo' onClick={this.handleSelectClick}>
              搜索
            </div>
          </div>
          <ul className='selectTable'>
            {info}
          </ul>
        </Modal>
      </div>
    )
  }
}