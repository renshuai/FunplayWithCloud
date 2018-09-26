const app = getApp()
var type = 'common'; //识别类型，默认是common通用识别
Page({
  data: {
    leftImageUrl: '',
    rightImageUrl: '',
    result: null
  },
  onLoad: function (options) {
    
  },
  chooseImage(event) {
    const currentTarget = event.currentTarget;
    const index = currentTarget.dataset.index;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        if (res.tempFilePaths.length) {
          const tempPath = res.tempFilePaths[0];
          if (+index === 1) {
            this.setData({
              leftImageUrl: tempPath
            });
          } else {
            this.setData({
              rightImageUrl: tempPath
            });
          }
        }
      }
    })
  },
  readFile(url) {
    return new Promise((resolve, reject) => {
      const fs = wx.getFileSystemManager();
      fs.readFile({
        filePath: url,
        encoding: 'base64',
        success: res => {
          resolve(res.data);
        },
        fail: error => {
          reject(error);
        }
      })
    })
  },
  compare() {
    if (this.data.leftImageUrl && this.data.rightImageUrl) {
      this.readFile(this.data.leftImageUrl).then(response1 => {
        this.readFile(this.data.rightImageUrl).then(response2 => {
          let param = [
            {
              "image": response1,
              "image_type": "BASE64"
            },
            {
              "image": response2,
              "image_type": "BASE64"
            }
          ]
          this.matchImage(param);
        })
      })
    } else {
      wx.showToast({
        title: '图片不能为空'
      })
    }
  },
  matchImage(param) {
    this.setData({
      result: null
    })
    wx.showLoading({
      title: '对比中'
    })
    const access_token = app.globalData.access_token;
    let baseUrl = 'https://aip.baidubce.com/rest/2.0/face/v3/match';
    const url = baseUrl + '?access_token=' + access_token;
    wx.request({
      url: url,
      method: 'POST',
      header: {
        "Content-Type": "application/application/json"
      },
      data: param,
      dataType: 'json',
      success: (response) => {
        wx.hideLoading();
        if (response.data.error_code) {
          wx.showToast({
            title: response.data.error_msg
          })
          return;
        }
        if (response.data.result) {
          this.setData({
            result: response.data.result
          });
        }
      },
      fail: (error) => {
        wx.showToast({
          title: '请求出错'
        })
        wx.hideLoading();
      }

    });
  }
})