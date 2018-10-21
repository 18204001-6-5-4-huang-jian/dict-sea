import React, { Component } from 'react'
import { getMenuDetails, updateLog } from '../../api'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import DetailInfo from './DetailInfo'
import "../../css/table.css"
import { Pagination, message } from 'antd';
import moment from 'moment'
import { observer, inject } from 'mobx-react'

@inject('listStore', 'detailStore') @observer
class DetailList extends Component {
  constructor () {
    super()
    this.state = {
      data: [],
      pagination: {},
      detailInfo: {},
      loading: true,
      activeName:'',
      detailInfoParams: {
        cname: '',
        cid: '',
        dict_word: ''
      }
    }
  }

  handleListInfo = async () => {
    const { listStore } = this.props;
    const cname  = this.props.params.cname;
    const id = this.props.params.id;
    listStore.cname = cname;
    listStore.id = id;
    const detailsData = await getMenuDetails(cname, id);
    const data = detailsData.data.data.list;
    const total = detailsData.data.data.total;
    listStore.listItems = data; //列表页数据
    listStore.total = total;
    listStore.current = 1;
    this.setState({
      detailInfo: data[0],
      loading: false
    })
    listStore.listFirstInfo = {
      cname: cname,
      cid: id,
      dict_word: data[0] && data[0].dict_word
    }
    this.handleTitile();
  }

  async componentDidUpdate (prevProps, prevState) {
    if (prevProps.params.cname !== this.props.params.cname) {
      this.handleListInfo();
    }
  }

  getDeepestItem = (arr) => {
    if (arr.length && arr[0].subs) {
      return this.getDeepestItem(arr[0].subs)
    }

    if (arr.length && !arr[0].subs) {
      return arr[0]
    }
  }

  async componentDidMount(){
    this.handleListInfo();
  }

  render () {
    const { listStore, detailStore } = this.props;
    const data = listStore.listItems;
    const pagination = listStore.pagination;
    return (
      <div>
        <div className="list-table">
          <Table
            dataSource={data.slice()}
            columns={listStore.columns.slice()}
            pagination={false}
            className="table"
            loading={this.state.loading}
            rowKey="index"
            onRow={record => {
              return {
                onClick: (e) => {
                  this.handleBackground(e);
                  detailStore.status = 0;
                  listStore.selectedItem = {
                    cname: this.props.params.cname,
                    cid: this.props.params.id,
                    dict_word: record.dict_word,
                    id:record.id
                  }
                  listStore.listFirstInfo = {
                    cname: this.props.params.cname,
                    cid: this.props.params.id,
                    dict_word: record.dict_word
                  }
                }
              }
            }}
          />
          {
            !!listStore.isShowDetail  && 
            <div className="detail">
            <DetailInfo {...listStore.listFirstInfo} />
            </div>
          }
        </div>
        <div>
          <Pagination 
            defaultCurrent={1} 
            total={Number(listStore.total)}
            pageSize={20}
            showQuickJumper={true} 
            onChange={this.onChange}
            current={listStore.current}
          />
        </div>
      </div>
    )
  }

  handleTitile = () => {
    const col = document.getElementsByTagName('td');
    for(let i in col) {
      if(col[i].innerText) {
        col[i].setAttribute('title',col[i].innerText.toString())          
      }
    }
  }

  handleBackground = (e) => {
    if(e.target.parentNode.className.indexOf('listActive') == -1) {
      this.setState({
        activeName: e.target.parentNode.className
      })
    }
    const node = e.target.parentNode.parentNode.childNodes
    for(let i = 0; i< node.length; i++) {
      if(node[i].className.indexOf('listActive') != -1) {
        node[i].className = this.state.activeName
      }
    }
    e.target.parentNode.className +=' '+'listActive';
  }

  onChange = async (page) => {
    const { listStore } = this.props;
    const cname = listStore.cname;
    const id = listStore.id;
    this.setState({
      loading: true
    });
    if(listStore.funStatus) {
      let startTime = localStorage.getItem("detail-startTime");
      let endTime = localStorage.getItem("detail-endTime");
      // localStorage.removeItem('detail-startTime');
      // localStorage.removeItem('detail-endTime');
      const updateData = await updateLog(cname, startTime, endTime, { offset: (page) * 1, ...this.props.location.query });
      if(updateData.data.success) {
        const data = updateData.data.data.list;
        listStore.listItems = data;
        this.handleTitile();
      }else {
        message.error('请求列表数据失败');
      }
      this.setState({
        loading: false
      });
    }else {
      const res = await getMenuDetails(cname,id,{ offset: (page) * 1, ...this.props.location.query });
      if(res.data.success) {
        const data = res.data.data.list
        listStore.listItems = data; //列表页数据
        listStore.listFirstInfo = {
          cname: cname,
          cid: id,
          dict_word: data[0] && data[0].dict_word
        }
        this.handleTitile();
      }else {
        message.error('请求列表数据失败');
      }
      this.setState({
        loading: false
      })
    }
    listStore.current = page;
  }
}

export default DetailList
