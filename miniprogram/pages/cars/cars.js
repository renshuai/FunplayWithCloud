//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    chooseImageUrl: '',
    skip: 0,
    index: 0,
    list: [],
    rightIndex: -1,
    clickIndex: -1,
    isAutoNext: false,
    timeout: 1000
  },
  onLoad: function (options) {
    this.getData();
  },
  getData(){
    const db = wx.cloud.database({
      env: app.globalData.env
    })
    if (this.data.skip > 0) {
      return db.collection('car1').skip(this.data.skip * 20)
        .get()
        .then(result => {
          this.setData({
            skip: this.data.skip + 1,
            list: result.data
          }, _ => {
            return true;
          })
        })
    } else {
      return db.collection('car1')
        .get()
        .then(result => {
          console.log(result.data);
          this.setData({
            skip: this.data.skip + 1,
            list: result.data
          }, _ => {
            return true;
          })
        })
    }
  },
  optionTap(e) {
    const currentTarget = e.currentTarget;
    const option = +currentTarget.dataset.option;
    this.setData({
      clickIndex: option,
      rightIndex: +(this.data.list[this.data.index]['val'])
    }, _ => {
      if (this.data.isAutoNext) {
        // 跳转到下一题
        setTimeout(_ => {
          this.next();
        },this.data.timeout);
      }
    })
  },
  switchChange(e) {
    this.setData({
      isAutoNext: e.detail.value
    }, _ => {
      if (this.data.isAutoNext && this.data.clickIndex !== -1) {
        setTimeout(_ => {
          this.next();
        }, this.data.timeout);
      }
    })
  },
  prev() {
    if (this.data.index > 0) {
      this.setData({
        index: this.data.index - 1,
        clickIndex: -1
      })
    } else {
      this.setData({
        skip: this.data.skip - 1
      }, _ => {
        this.getData().then(_ => {
          this.setData({
            index: this.data.list.length - 1,
            clickIndex: -1
          })
        })
      })
    }
  },
  next() {
    if (this.data.index < (this.data.list.length - 1)) {
      this.setData({
        index: this.data.index + 1,
        clickIndex: -1
      })
    } else {
      this.getData().then(_ => {
        this.setData({
          index: 0,
          clickIndex: -1
        })
      })
    }
  }
})
