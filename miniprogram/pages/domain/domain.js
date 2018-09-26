//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    beian: null,
    wangbei: null,
    domain: '',
    fetchBeian: false,
    fetchWangbei: false
  },
  onLoad: function () {
  },
  inputChange(e) {
    this.setData({
      domain: e.detail.value
    })
  },
  queryDomain() {
    wx.showLoading({
      title: '请求中'
    })
    this.setData({
      fetchBeian: false,
      fetchWangbei: false
    })
    // 查询域名备案
    wx.request({
      url: 'https://www.sojson.com/api/beian/' + this.data.domain,
      success: res => {
        if (res.data && res.data.type === 200) {
          this.setData({
            beian: res.data
          })
        } else {
          this.setData({
            beian: null
          })
        }
      },
      fail: error => {
        wx.showToast({
          title: error.data.message
        })
      },
      complete: res => {
        this.setData({
          fetchBeian: true
        }, _ => {
          if (this.data.fetchWangbei) {
            wx.hideLoading();
          }
        })
      }
    });
    this.queryGonganWangbei();
    
  },
  queryGonganWangbei() {
    setTimeout(_ => {
      // 查询公安网备
      wx.request({
        url: 'https://www.sojson.com/api/gongan/' + this.data.domain,
        success: res => {
          if (res.data && res.data.status === 200) {
            this.setData({
              wangbei: res.data.data
            })
          } else {
            this.setData({
              wangbei: null
            })
            wx.showToast({
              title: res.data.message
            })
          }
        },
        fail: error => {
          wx.showToast({
            title: error.data.message
          })
        },
        complete: res => {
          this.setData({
            fetchWangbei: true
          }, _ => {
            if (this.data.fetchBeian) {
              wx.hideLoading();
            }
          })
        }
      });
    },3100)
  }
})
