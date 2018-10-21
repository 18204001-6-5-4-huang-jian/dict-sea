import { observable, action } from 'mobx'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import moment from 'moment'

class FeedBackStore {

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @observable total = '' // 分页信息
  @observable feedBackItem =[]//列表数据信息
  @observable feedBackDetail = []//存放反馈列表选中的数据id
  @observable current = 1 //默认页码
  @observable funStatus = ''//判断点击那些功能
  @observable cname = ''//跳转路由的class_name
  @observable foo = false //判断是否选择了信息
  @observable selectedRows = []//点击选择框时每一行的全部信息
  @observable modalPrimaryStatus = false//判断是否点击添加主键
  @observable modalSynonymStatus = false//判断是否点击添加同义词
  @observable feedBackSelect = []//搜索词性列表信息
  @observable class_name = ''//保存点击返回的信息 
  @observable revokeArr = [] //存放需要撤销操作的信息id
  @observable recoveryArr = []//存放需要恢复操作的信息id
  @observable recoveryStatus = false //恢复操作的状态
  @observable operateStatus = 0;//判断是什么操作(1:通过,2:驳回,...)
  @observable listenDatepicker = false//显示DateTimepicker
  @observable dateTimeStatus = ''//判断点击了操作记录
  @observable filterInfoStatus = true//判断筛选的状态
  @observable startTime = ''//日历起始时间
  @observable endTime = ''//日历截止时间
  @observable columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '反馈词',
      dataIndex: 'dict_word'
    },
    {
      title: '标注词性',
      dataIndex: 'class_name'
    },
    {
      title: '反馈时间',
      dataIndex: 'create_time',
      render: (date) => moment(date).format("YYYY-MM-DD")
    }
  ];
}

export default FeedBackStore