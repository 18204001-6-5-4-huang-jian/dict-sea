import { observable, action } from 'mobx'
import Table from 'antd/lib/table'
import 'antd/lib/table/style'
import moment from 'moment'
class UpdateStore{
    constructor (rootStore) {
        this.rootStore = rootStore
    }
    @observable total = '' // 分页信息
    @observable updateItem =[]
    @observable updateTabDetail = []
    @observable cname = ''
    @observable funStatus = ''//判断点击那些功能
    @observable current = 1 //默认页码
    @observable filters = []//筛选的值
    @observable foo = false //通过、驳回的状态
    @observable reState = []//恢复功能存放id
    @observable listenDatepicker = false//显示DateTimepicker
    @observable startTime = ''//日历起始时间
    @observable endTime = ''//日历截止时间
    @observable dateTimeStatus = ''//判断点击了更新日志还是操作记录
    @observable filterStatus = false//判断是否点击筛选功能
    @observable filterInfoStatus = true//判断筛选的状态
    @observable columns = [
          {
            title: '词性',
            dataIndex: 'class_name'
          },
          {
            title: '操作记录的id',
            dataIndex: 'id',
          },
          {
            title: '更新字段',
            dataIndex: 'update_field',
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
            title: '更新时间',
            dataIndex: 'update_time',
            render: (date) => moment(date).format("YYYY-MM-DD")
          }
      ]
}
export default UpdateStore