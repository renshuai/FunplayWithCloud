//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    date: '',
    calendar: null
  },
  onLoad: function () {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    console.log(date);
    this.setData({
      date: date
    }, _ => {
      this.getCalendarResult();
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    }, _ => {
      this.getCalendarResult();
    })
  },
  getCalendarResult() {
    wx.request({
      url: 'https://www.sojson.com/open/api/lunar/json.shtml?date=' + this.data.date,
      success: res => {
        if (res.data && res.data.status === 200) {
          let calendar = res.data.data;
          calendar.week = {'Monday': '星期一', 'Tuesday': '星期二','Saturday': '星期三', 'Thursday': '星期四', 'Friday': '星期五', 'Saturday': '星期六', 'Sunday': '星期日'}[calendar.week];         if (calendar.festivalList.length) {
            calendar.festivalList = calendar.festivalList.join(' ');
          }
          this.setData({
            calendar: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: error => {
        wx.showToast({
          title: error.data.message
        })
      }
    })
  }
})
