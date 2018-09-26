

Page({
  data: {
    logs: [],
    jokes: [],
    page: 1,
    loading: false
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.getJokes().then(flag => {
      if (flag) {
        wx.hideLoading();
      }
    });
  },
  getJokes() {
    return new Promise((resolve, reject) => {
      this.setData({
        loading: true
      }, _ => {
        wx.request({
          url: 'https://www.apiopen.top/satinApi?type=1&page=' + this.data.page,
          success: res => {
            if (res.data && res.data.code === 200) {
              this.setData({
                jokes: [...this.data.jokes, ...res.data.data],
                page: (this.data.page + 1),
                loading: false
              })
              resolve(true);
            } else {
              reject(false);
            }
          },
          fail: error => {
            reject(false);
          }
        })
      })
     
    })
    
  },
  scroll(event) {
    console.log(event);
  }
})
