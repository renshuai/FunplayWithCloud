//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    detectResult: null,
    chooseImageUrl: '',
    type: 'general_basic',
    id_card_side: 'front',
    name: ''
  },
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        type: options.type,
        name: options.name
      })
    }
  },
  // 身份证照片获取
  idcardChooseImage(event) {
    // this.chooseImage();
    const currentTarget = event.currentTarget;
    console.log(event);
    if (currentTarget.dataset && currentTarget.dataset.side) {
      const side = currentTarget.dataset.side;
      this.setData({
        id_card_side: side
      }, _ => {
        this.chooseImage();
      })
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
    const baseUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/' + this.data.type;
    const url = baseUrl + '?access_token=' + access_token;
    let params = {
      image: base64Url
    };
    if (this.data.type === 'idcard') {
      params.id_card_side = this.data.id_card_side;
    }
    wx.request({
      url: url,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: params,
      dataType: 'json',
      success: (response) => {
        wx.hideLoading();
        if (response.data.error_code) {
          wx.showToast({
            title: response.data.error_msg
          })
          return;
        }
        const data = response.data;
        switch (this.data.type) {
          case 'bankcard':
            this.setData({
              detectResult: data.result,
              type: this.data.type
            });
            break;
          case 'general_basic':
          case 'idcard':
          case 'driving_license':
          case 'vehicle_license': 
          case 'license_plate':
          case 'business_license':
          case 'passport':
          case 'vat_invoice':
          case 'receipt':
          default:
            this.setData({
              detectResult: data.words_result,
              type: this.data.type
            })
            break;
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
