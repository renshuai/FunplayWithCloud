//index.js
//获取应用实例
const app = getApp()
var type = 'common'; //识别类型，默认是common通用识别
Page({
  data: {
    detectResult: null,
    chooseImageUrl: ''
  },
  onLoad: function (options) {
    console.log(options);
    if (options.type) {
      type = options.type;
    }
  },
  // 获取照片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showLoading({
          title: '正在识别中'
        });
        if (res.tempFilePaths.length) {
          const tempPath = res.tempFilePaths[0];
          this.setData({
            chooseImageUrl: tempPath
          });
          this.readFile(tempPath);
        }
      }
    })
  },
  // 读取图片并将图片转化为base64
  readFile(url) {
    console.log(url);
    const fs = wx.getFileSystemManager();
    fs.readFile({
      filePath: url,
      encoding: 'base64',
      success: res => {
        this.detectImg(res.data);
      }
    })
  },
  // 图像识别
  detectImg(base64Url) {
    const access_token = app.globalData.access_token;
    // let url = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + access_token;
    let baseUrl = '';
    switch (type) {
      case 'common': 
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general';
        break;
      case 'vegetables':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish';
        break;
      case 'car':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/car'; break;
      case 'logo':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/logo';break;
      case 'animal':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/animal';break;
      case 'plant':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant';break;
      case 'flower':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/flower';break;
      case 'ingredient':
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient';
        break;
      default:
        baseUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general';
    }
    const url = baseUrl + '?access_token=' + access_token;
    wx.request({
      url: url,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        image: base64Url
      },
      dataType: 'json',
      success: (response) => {
        console.log(response);
        if (response.data.error_code) {
          wx.showToast({
            title: response.data.error_msg
          })
          wx.hideLoading();
          return;
        }
        if (response.data.result && response.data.result.length) {
          const result = response.data.result[0];
          console.log(result);
          let detectResult = null;
          switch (type) {
            case 'common':
              detectResult = result;break;
            case 'vegetables':
              detectResult = {
                keyword: result.name,
                score: +result.probability
              };break;
            case 'car':
              detectResult = {
                keyword: result.name,
                score: +result.score
              }; break;
            case 'logo':
              detectResult = {
                keyword: result.name,
                score: +result.probability
              }; break;
            case 'animal':
              detectResult = {
                keyword: result.name,
                score: +result.score
              }; break;
            case 'plant':
            case 'flower':
            case 'ingredient':
              detectResult = {
                keyword: result.name,
                score: +result.score
              }; break;
            default: 
              detectResult = result; 
          }
          if (detectResult) {
            this.setData({
              detectResult: detectResult
            });
            wx.hideLoading();
          }
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
