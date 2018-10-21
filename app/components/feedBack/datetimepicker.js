import React, { Component } from "react"
import { Link, hashHistory } from "react-router"
import {DatePicker,Icon,message} from 'antd'
import { observer, inject } from 'mobx-react'
import { updateLogInfo, updateLogFilter } from '../../api'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import moment from 'moment'

@inject('feedbackStore') @observer
export default class Datetimepicker extends Component{
  constructor(props){
      super(props)
      this.state={
            text:'至',
            placeholder:'选择时间'
      }
  }
  timeStartChange = (date,dateString) => {
    const { feedbackStore } = this.props;
    feedbackStore.startTime = dateString;
    localStorage.setItem("startTime-", dateString);
    this.fillDate();
  }
  timeEndChange = (date,dateString) => {
    const { feedbackStore } = this.props;
    feedbackStore.endTime = dateString;
    localStorage.setItem("endTime-", dateString);
    this.fillDate();
  }

  fillDate = async () => {
    const { feedbackStore } = this.props;
    const class_name = feedbackStore.cname;
    if(feedbackStore.startTime != '' && feedbackStore.endTime != ''){
      //获取筛选的数据
      feedbackStore.funStatus = 1;
      let startTime = feedbackStore.startTime;
      let endTime = feedbackStore.endTime;
      feedbackStore.startTime = '';
      feedbackStore.endTime = '';
      if(feedbackStore.dateTimeStatus == 1) {
        feedbackStore.columns = [
          {
            title: '主键',
            dataIndex: 'id' 
          },
          {
            title: '更新字段',
            dataIndex: 'update_field'
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
            render(pass){
              if(pass === 0){
              return <span style={{color:'#3299FF'}}>审核中</span>
              }else if(pass === 1){
              return <span style={{color:'#1DAC00'}}>审核通过</span>
              }else if(pass === 2){
              return <span style={{color:'#FF0000'}}>驳回</span>
              }
            }
          }
        ];
        const updateData = await updateLogInfo(class_name, startTime, endTime);
        const data = updateData.data.data.list;
        const total = updateData.data.data.total;
        feedbackStore.feedBackItem = data;
        feedbackStore.total = total;
        feedbackStore.current = 1;
      }
    }
  }

  render() {
    return(
      <div className="DatePicker-container" style={{textAlign:'right'}}>
        <DatePicker
          showTime
          placeholder={this.state.placeholder}
          onChange={this.timeStartChange}
        />
        <span className="span">{this.state.text}</span>
        <DatePicker
          showTime
          placeholder={this.state.placeholder}
          onChange={this.timeEndChange}
        />
      </div>
    )
  }
}