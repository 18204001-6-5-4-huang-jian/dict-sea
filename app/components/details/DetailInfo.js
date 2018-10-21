import React, { Component } from 'react'
import { getDetailInfo } from '../../api'
import { observer, inject } from 'mobx-react'
import { getMenuDetails, updateWord } from '../../api'
import ListStore from '../../stores/listStore';
import {Modal,message,Button} from 'antd'
import '../../css/details.css'

@inject('listStore','detailStore') @observer
class DetailInfo extends Component {
  constructor () {
    super()
    this.state = {
      
    }
  }
  componentDidMount () {
    const { detailStore } = this.props;
    document.onClick = () => {
     detailStore.status = 0;
    };
  }
  async componentWillReceiveProps (nextProps){
    if (nextProps.dict_word === this.props.dict_word) return;
    const { cid, cname, dict_word, detailStore} = nextProps;
    const response = await getDetailInfo(cname, cid, dict_word);
      if(!response){
        detailStore.data = {};
        detailStore.showDetailTitle = false;
        message.info('对不起,当前主词暂时没有词条详情');
      }else{
            const data = response.data.data;
            //利用mobx确定删除的元素
            detailStore.selectedItem = data.info;
            detailStore.head = data.head;
            //存下update和create时间戳，用于post保存
            detailStore.create_time = (new Date(data.info.create_time)).getTime();
            detailStore.update_time =(new Date()).getTime();
            detailStore.infoStatus = data.info.status;
            detailStore.classIndex= data.info.class_index;
            detailStore.className = data.info.class_name;
            detailStore.showDetailTitle = true;
            const temp = {};
            for (let key in data.head) {
              temp[data.head[key]] = data.info[key]
            }
            //赋值给全局变量 detailStore.data(渲染详情的数据)
            detailStore.data = temp;
            //解决双击之后的直接保存
            const inputChange = {};
            for (let key in detailStore.head) {
              //处理成英文的key
              inputChange[key] = detailStore.data[detailStore.head[key]]
            }
            detailStore.updateInfo = inputChange;
            // console.log(detailStore.updateInfo);
          }
  }
  render () {
    const { listStore, detailStore } = this.props;
    const data = detailStore.data;
    const myinner = Object.keys(data).map((key) => (
      <div className="line_detail" key={key}>
        <span>{key} : </span>
      <input
        id="info-input"
        className="infoInput" 
        type="text"
        value={data[key]}
        onChange={(e)=>this.handleInputChange(e, key)} 
        readOnly={detailStore.status==0?true:false} 
        title={data[key]}
        onClick={ detailStore.status == 1 ? (e) =>this.handleClick(e,key) : null}
        onDoubleClick={ detailStore.status == 0 || detailStore.status == 2 ? (e) =>this.handleDoubleClick(e,key) : null}
        onMouseDown={(e) => {e.preventDefault()}}
      /> 
      </div>
    ))

    return (
      <div className="info">
        <div className="info-title" id="info-title">
          词 条 详 情
        </div>
        <div className="details">
          {myinner}
        </div>
        {detailStore.status == 2 && <Button type="primary" className="saveButton" onClick={this.saveInformation}>确认保存</Button>}
      </div>
    )
  }

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

  handleInputChange = (e, key) => {
    const { detailStore } = this.props;
    //改变渲染的数据
    detailStore.data[key] = e.target.value;
    //用于保存提交的数据
    detailStore.postData = detailStore.data;
    const inputChange = {};
    for (let key in detailStore.head) {
    //处理成英文的key
    inputChange[key] = detailStore.data[detailStore.head[key]]
    }
    detailStore.updateInfo = inputChange;
  }

  handleClick = (e, key) => {
    const { detailStore } = this.props;
    e.target.readOnly = false;
    e.target.focus();
 }

  handleDoubleClick = (e, key) => {
     const { detailStore } = this.props;
     e.target.readOnly = false;
     e.target.focus();
     if(detailStore.status == 1){
       detailStore.status = 1;
     }else if(detailStore.status == 0){
       detailStore.status = 2;
     }
  }
  saveInformation = async () => {
    const { detailStore } = this.props;
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
    // console.log(saveInfo);
    if(!saveInfo) {
      message.error('保存失败请重新进行修改操作');
    }else if(saveInfo.data.success) {
      message.success('保存成功');
      detailStore.status = 0;
      this.handleClickOperation();
    }
  }
}

export default DetailInfo
