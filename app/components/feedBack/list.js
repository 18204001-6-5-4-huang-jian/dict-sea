import React, { Component } from 'react'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import "../../css/table.css"
import moment from 'moment'
import { Pagination, message } from 'antd';
import { observer, inject } from 'mobx-react'
import { feedBackList, updateLogInfo, updateDetailinfo, updateLogFilter } from '../../api'

@inject('feedbackStore') @observer
export default class FeedBackList extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      pageStatus: false,
      loading:  true
    }
  }

  handleFeedBackList = async () => {
    const { feedbackStore } = this.props;
    const cname = this.props.params.class_name;
    feedbackStore.cname = cname;
    const updateData = await feedBackList(cname);
    const data = updateData.data.data.list;
    const total = updateData.data.data.total;
    feedbackStore.feedBackItem = data;
    feedbackStore.total = total;
    feedbackStore.current = 1;
    this.setState({
      loading: false
    });
  }

  async componentDidMount() {
    this.handleFeedBackList();
  }

  async componentDidUpdate (prevProps, prevState){
    if (prevProps.params.class_name !== this.props.params.class_name) {
      this.handleFeedBackList();
    }
  }

  render() {
    const { feedbackStore } = this.props;
    const data = feedbackStore.feedBackItem;
    const pagination = feedbackStore.pagination;
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const arr = [];
        feedbackStore.selectedRows = selectedRows;
        for(var i in selectedRows) {
         const id = selectedRows[i].id
         arr.push(id)
        }
        const newArr = [...new Set(arr)]
        feedbackStore.feedBackDetail = newArr
        if(selectedRowKeys != '') {
          feedbackStore.foo = true
        } else {
          feedbackStore.foo = false
        }
      }
    };

    return (
			<div>
        <div className="list-table">
          <Table
            dataSource = {data.slice()}
            pagination = {false}
            rowSelection={feedbackStore.dateTimeStatus?null : rowSelection}
            columns={feedbackStore.columns.slice()}
            onChange={this.handleFilterChange}
            loading={this.state.loading}
            rowKey="index"
            className="table"
          />
        </div>
        <div>
          <Pagination 
            defaultCurrent={1} 
            total={Number(feedbackStore.total)}
            pageSize={20}
            showQuickJumper={true} 
            onChange={this.onChange}
            current={feedbackStore.current}
          />
        </div>
      </div>
		)
  }

  handleFilterChange = async (pagination, filters, sorter) => {
    const { feedbackStore } = this.props;
    console.log('各类参数是', pagination, filters, sorter);
    if(filters.pass.length>1) {
      message.warning('对不起当前只允许进行单个筛选');
    }else if(filters.pass.length == 1) {
      const cname = feedbackStore.cname;
      feedbackStore.filters = filters.pass[0];
      const updateData = await updateDetailinfo(cname , feedbackStore.filters)
      const data = updateData.data.data.list;
      const total = updateData.data.data.total;
      feedbackStore.feedBackItem = data;
      feedbackStore.total = total;
      feedbackStore.current = 1;
      this.setState({
        pageStatus: true
      })
    }else if(filters.pass.length == 0) {
      const class_name = feedbackStore.cname;
      const updateData = await updateLogFilter(class_name);
      const data = updateData.data.data.list;
      const total = updateData.data.data.total;
      feedbackStore.feedBackItem = data;
      feedbackStore.total = total;
      feedbackStore.current =1; 
      this.setState({
        pageStatus: false
      })
    }
  }

  onChange = async (page) => {
    const { feedbackStore } = this.props;
    const cname = feedbackStore.cname;
    this.setState({
      loading: true
    });
    if(feedbackStore.funStatus) {
      let startTime = localStorage.getItem("startTime-");
      let endTime = localStorage.getItem("endTime-");
      // localStorage.removeItem('startTime-');
      // localStorage.removeItem('startTime-');
      const updateData = await updateLogInfo(cname, startTime, endTime, { offset: (page) * 1, ...this.props.location.query });
      console.log(updateData)
      if(updateData.data.success) {
        const data = updateData.data.data.list;
        feedbackStore.feedBackItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }else if(feedbackStore.dateTimeStatus == 2 && this.state.pageStatus == false){
      const res = await updateLogFilter(cname, { offset: (page) * 1, ...this.props.location.query });
      if(res.data.success) {
        const data = res.data.data.list;
        feedbackStore.feedBackItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }else if(feedbackStore.dateTimeStatus == 2 && this.state.pageStatus) {
      const pass = feedbackStore.filters;
      const res = await updateDetailinfo(cname, pass, { offset: (page) * 1, ...this.props.location.query });
      console.log(res)
      if(res.data.success) {
        const data = res.data.data.list;
        feedbackStore.feedBackItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }
    else {
      const updateData = await feedBackList(cname, { offset: (page) * 1, ...this.props.location.query });
      if(updateData.data.success) {
        const data = updateData.data.data.list;
        feedbackStore.feedBackItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }
    feedbackStore.current = page
  }

} 