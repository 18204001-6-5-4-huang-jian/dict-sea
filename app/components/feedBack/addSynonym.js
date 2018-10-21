import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { Table, message, Modal } from 'antd';
import { feedBackList, selectPrimary, addSynonym } from '../../api'

@inject('feedbackStore') @observer
export default class AddSynonym extends Component{
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
    const inputValue = selectedRows[0].dict_word;
    if(inputValue) {
      const res = await selectPrimary(inputValue);
      const data = res.data.data;
      if(res.data.data.length != 0) {
        this.setState({
            feedBackSelect: data
        })
      }else if(res.data.data.length == 0) {
        layer.msg('没有对应的结果');
      }
    }else if(inputValue == '') {
      layer.msg('搜索不能为空，请填写要搜索的主词')
    }
  }

  handleClickLi = (params) => {
    var name = params[0]
    var index = params[1]
    this.setState({
      inputValue: name,
      clickNum:index
    })
    layer.msg('您选择了同义词：'+name);
  }

  handleOk = async (synonym) => {
    const { feedbackStore } = this.props;
    if(this.state.inputValue == '') {
      layer.msg('请选择你想要添加的同义词');
    }else {
      const dict_word =  feedbackStore.selectedRows[0].dict_word;
      feedbackStore.selectedRows[0].dict_word = this.state.inputValue;
      feedbackStore.selectedRows[0].synonyms = synonym;
      const data = feedbackStore.selectedRows[0];
      const res = await addSynonym(data);
      feedbackStore.modalSynonymStatus = false;
      if(res.data.success) {
        const addSynonymArr = []
        message.success('添加同义词成功');
        this.handleFeedBackList();
        feedbackStore.foo = false;
        feedbackStore.operateStatus = 5;
        addSynonymArr.push(data.id)
        feedbackStore.revokeArr = addSynonymArr;
        feedbackStore.recoveryArr = addSynonymArr;
      }else {
        feedbackStore.modalSynonymStatus = false;
        feedbackStore.selectedRows[0].dict_word = dict_word;
        this.handleFeedBackList();
        message.error('添加同义词失败,请重新操作');
      }
    }
  }

  handleCancel = (e) => {
    const { feedbackStore } = this.props;
    feedbackStore.modalSynonymStatus = false;
  }
  
  render() {
    const { feedbackStore } = this.props;
    const { feedBackSelect } = this.state;
    const selectedRows = feedbackStore.selectedRows;
    const info = feedBackSelect.map((item, index) => {
      var params = [item,index]
      return <li className={this.state.clickNum==index ? "selectedLi" : "selectLi"} key={index} onClick = {() => {this.handleClickLi(params)}}>{item}</li>
    })

    return (
      <div>
        <Modal title="搜索主词" 
          visible={feedbackStore.modalSynonymStatus}
          onOk={this.handleOk.bind(this, selectedRows[0].dict_word)} 
          onCancel={this.handleCancel}
          okText={'添加为同义词'}
          cancelText={'取消'}
        >
          <div className='modalImport'>
            <img className = 'modalSelect' src="../../images/preview7.png" />
            <input className = 'modalInput' value={selectedRows[0].dict_word} readOnly/>
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