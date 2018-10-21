/*
 * Created by jhuang on 2018/3/21.
 */
import React, { Component } from "react"
import { Link, hashHistory } from "react-router"
import {DatePicker,Icon,message} from 'antd'
import { observer, inject } from 'mobx-react'
import {updateLog} from '../../api'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import moment from 'moment'

@inject('listStore','detailStore') @observer
export default class Datetimepicker extends Component{
    constructor(props){
        super(props)
        this.state={
             text:'至',
             placeholder:'选择时间'
        }
    }
    timeStartChange = (date,dateString) => {
        const {listStore} = this.props;
        listStore.startTime = dateString;
        localStorage.setItem('detail-startTime',dateString);
        this.fillDate();
    }
    timeEndChange = (date,dateString) => {
        const {listStore} = this.props;
        listStore.endTime = dateString;
        localStorage.setItem('detail-endTime',dateString);
        this.fillDate();
    }

    handleTitile = () => {
      const col = document.getElementsByTagName('td');
      for(let i in col) {
        if(col[i].innerText) {
          col[i].setAttribute('title',col[i].innerText.toString())          
        }
      }
    }

    fillDate = () => {
        const {listStore,detailStore} = this.props;
        const class_name = listStore.cname;
        if(listStore.startTime != '' && listStore.endTime != ''){
            //获取筛选的数据
            listStore.funStatus = 1;
            let startTime = listStore.startTime;
            let endTime = listStore.endTime;
            listStore.startTime = '';
            listStore.endTime = '';
            const response = updateLog(class_name,startTime,endTime);
            response.then((detailsData) => {
                const data = detailsData.data.data.list;
                const total = detailsData.data.data.total;
                listStore.listItems = data;
                listStore.total = total;
                this.handleTitile();
                if(listStore.state == 1) {
                  listStore.columns = [
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
                    }
                  ]
                  // listStore.state = '';
                }else if(listStore.state == 2) {
                  listStore.columns = [
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
                  ]
                  // listStore.state = '';
                }
            })
        }
    }
    render(){
        // const MonthPicker = DatePicker.MonthPicker;
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