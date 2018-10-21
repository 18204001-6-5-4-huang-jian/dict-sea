import React, { Component } from 'react'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import "../../css/table.css"
import moment from 'moment'
import { Pagination, message } from 'antd';
import { observer, inject } from 'mobx-react'
import { updateDetail, updateDetailinfo, updateLogInfo, updateLogFilter } from '../../api'

@inject('updateStore') @observer
export default class List extends Component {
	constructor (props) {
		super(props)
		this.state = {
      data: [],
      pageStatus: false,//判断是否筛选了数据
			loading: true
		}
	}

  handleUpdateList = async () => {
    const { updateStore } = this.props;
    const cname = this.props.params.class_name;
    updateStore.cname = cname;
    const pass = 0;
    const updateData = await updateDetailinfo(cname, pass);
    const data = updateData.data.data.list;
    const total = updateData.data.data.total;
    updateStore.updateItem = data;
    updateStore.total = total;
    updateStore.current = 1;
    this.setState({
      loading: false
    });
  }

  async componentDidUpdate (prevProps, prevState){
    if (prevProps.params.class_name !== this.props.params.class_name) {
      this.handleUpdateList();
    }
  }

  async componentDidMount(){
    this.handleUpdateList();
  }

	render() {
    const { updateStore } = this.props;
    const data = updateStore.updateItem;
    // const pagination = updateStore.pagination;
    const rowSelection = {
      onChange(selectedRowKeys, selectedRows) {
        const arr = [];
        for(var i in selectedRows) {
         const id = selectedRows[i].id
         arr.push(id)
        }
        const newArr = [...new Set(arr)];
        updateStore.updateTabDetail = newArr;
        if(selectedRowKeys != '') {
          updateStore.foo = true
        } else {
          updateStore.foo = false
        }
      }
    };
     
		return (
      <div>
        <div className="list-table">
          <Table
            dataSource = {data.slice()}
            pagination = {false}
            rowSelection={updateStore.dateTimeStatus?null : rowSelection}
            columns={updateStore.columns.slice()}
            onChange={this.handleFilterChange}
            loading={this.state.loading}
            rowKey="index"
            className="table"
          />
        </div>
        <div>
          <Pagination 
            defaultCurrent={1} 
            total={Number(updateStore.total)}
            pageSize={20}
            showQuickJumper={true} 
            onChange={this.onChange}
            current={updateStore.current}
          />
        </div>
      </div>
		)
  }
  //筛选功能里的筛选按钮
  handleFilterChange = async (pagination, filters, sorter) => {
    const { updateStore } = this.props;
    console.log('各类参数是', pagination, filters, sorter);
    if(filters.pass.length>1) {
      message.warning('对不起当前只允许进行单个筛选');
    }else if(filters.pass.length == 1) {//点击了筛选条件
      const cname = updateStore.cname;
      updateStore.filters = filters.pass[0];
      const updateData = await updateDetailinfo(cname , updateStore.filters)
      const data = updateData.data.data.list;
      const total = updateData.data.data.total;
      updateStore.updateItem = data;
      updateStore.total = total;
      updateStore.current = 1;
      this.setState({
        pageStatus: true
      })
    }else if(filters.pass.length == 0) {//没有点击筛选条件
      const class_name = updateStore.cname;
      const updateData = await updateLogFilter(class_name);
      const data = updateData.data.data.list;
      const total = updateData.data.data.total;
      updateStore.updateItem = data;
      updateStore.total = total;
      updateStore.current =1; 
      this.setState({
        pageStatus: false
      })
    }
  }
  //分页的change事件
  onChange = async (page) => {
    const { updateStore } = this.props;
    const cname = updateStore.cname;
    this.setState({
      loading: true
    });
    //判断是否点击了筛选功能时间选择
    if(updateStore.funStatus) {
      let startTime = localStorage.getItem("startTime");
      let endTime = localStorage.getItem("endTime");
      const updateData = await updateLogInfo(cname, startTime, endTime, { offset: (page) * 1, ...this.props.location.query });
      if(updateData.data.success) {
        const data = updateData.data.data.list;
        updateStore.updateItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }else if(updateStore.dateTimeStatus == 3 && this.state.pageStatus == false){//判断点击过筛选并且选择了筛选条件
      const res = await updateLogFilter(cname, { offset: (page) * 1, ...this.props.location.query });
      if(res.data.success) {
        const data = res.data.data.list;
        updateStore.updateItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }else if(updateStore.dateTimeStatus == 3 && this.state.pageStatus) {//判断点击过筛选并且没有选择筛选条件
      const pass = updateStore.filters;
      const res = await updateDetailinfo(cname, pass, { offset: (page) * 1, ...this.props.location.query });
      if(res.data.success) {
        const data = res.data.data.list;
        updateStore.updateItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }
    else {//审核更新的数据的分页
      const pass = 0;
      const res = await updateDetailinfo(cname, pass, { offset: (page) * 1, ...this.props.location.query });
      if(res.data.success) {
        const data = res.data.data.list;
        updateStore.updateItem = data;
      }else {
        message.error('请求数据列表失败');
      }
      this.setState({
        loading: false
      });
    }
    updateStore.current = page
  }
}