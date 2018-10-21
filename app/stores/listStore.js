import { observable, action } from 'mobx'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import moment from 'moment'

class ListStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @observable total = '' // 分页信息
  @observable listItems = [] //列表的数据
  @observable selectedItem = '' //包括cnam，cid,dict_word详情页面请求接口
  @observable cname = '' //id和cname用于页面刷新的请求的参数
  @observable current = 1 //默认页码
  @observable funStatus = '';
  @observable id = '' //id和cname用于页面刷新的请求的参数
  @observable isShowModal = false//控制上传文件页面的显示和隐藏
  @observable isShowRightModal = false//控制添加管理员页面的显示和隐藏
  @observable listenDatepicker = false//显示DateTimepicker
  @observable startTime = ''//日历起始时间
  @observable endTime = ''//日历截止时间
  @observable isShowDetail = true//是否显示Detailinfo
  @observable listFirstInfo = ''//存放列表信息的第一条
  @observable state = ''//判断点击是更新还是操作
  @observable insertStatus = ''//判断是否进行了插入
  @observable chartStarttime = ''//图表开始时间
  @observable chartEndtime = ''//图表结束时间
  @observable classIndex = 0 //图表侧边class_index
  @observable columns = [
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
  ]
}

export default ListStore