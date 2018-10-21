//action删除操作 
import { observable, action } from 'mobx'

class DeleteStore {

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @observable selectedItem = {}//用于数据删除
  @observable data = {}//用于插入数据清空
  @observable postData = {}//用于插入提交数据
  @observable status = 0//用于判断reaOnly状态
  @observable head = {}//用于改变翻译
  @observable create_time = ''//创建时间
  @observable update_time = ''//更新时间
  @observable infoStatus = ''//详情status
  @observable className = ''//筛选的class_name
  @observable classIndex = ''//词条索引
  @observable updateInfo = {}//detailInfo修改
  @observable showDetailTitle = true;//显示title
}

export default DeleteStore