import { observable } from 'mobx'
import ListStore from './listStore'
import DetailStore from './detailStore'
import UpdateStore from './updateStore'
import FeedbackStore from './feedbackStore'

class RootStore {
  constructor () {
    this.listStore = new ListStore(this)
    this.detailStore = new DetailStore(this)
    this.updateStore = new UpdateStore(this)
    this.feedbackStore = new FeedbackStore(this)
  }
}

export default RootStore