//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    detectResult: null,
    functionArrays: [
      {
        name: '图像识别',
        type: 'images',
        items: [
          {
            name: '通用识别',
            icon: 'icon-display',
            type: 'common',
            canUse: true
          },
          {
            name: '人脸对比',
            icon: 'icon-compare',
            type: 'face_compare',
            canUse: true
          },
          {
            name: '植物识别',
            icon: 'icon-zhiwu',
            type: 'plant',
            canUse: true
          },
          {
            name: '菜品识别',
            icon: 'icon-caipin',
            type: 'vegetables',
            canUse: true
          },
          {
            name: '车型识别',
            icon: 'icon-car',
            type: 'car',
            canUse: true
          },
          {
            name: '动物识别',
            icon: 'icon--rabbit',
            type: 'animal',
            canUse: true
          },
          {
            name: 'Logo识别',
            icon: 'icon-logo',
            type: 'logo',
            canUse: true
          }
          // {
          //   name: '花卉识别',
          //   icon: 'icon-flower',
          //   type: 'flower'
          // },
          // {
          //   name: '果蔬识别',
          //   icon: 'icon-navicon-cplb',
          //   type: 'ingredient'
          // }
        ]
      },
      {
        name: '文字识别',
        type: 'words',
        items: [
          {
            name: '通用识别',
            icon: 'icon-text',
            type: 'general_basic',
            canUse: true
          },
          {
            name: '身份证识别',
            icon: 'icon-shenfenzhengzhengmian',
            type: 'idcard',
            canUse: true
          },
          {
            name: '银行卡识别',
            icon: 'icon-bankcard',
            type: 'bankcard',
            canUse: true
          },
          {
            name: '驾驶证识别',
            icon: 'icon-jiashizhengzhuanru',
            type: 'driving_license',
            canUse: true
          },
          {
            name: '行驶证识别',
            icon: 'icon-buhuanhangshizheng',
            type: 'vehicle_license',
            canUse: true
          },
          {
            name: '车牌识别',
            icon: 'icon-chepai',
            type: 'license_plate',
            canUse: true
          },
          {
            name: '营业执照识别',
            icon: 'icon-solution',
            type: 'business_license',
            canUse: true
          },
          {
            name: '增值税发票',
            icon: 'icon-fapiao',
            type: 'vat_invoice',
            canUse: true
          },
          {
            name: '通用票据识别',
            icon: 'icon-fapiao1',
            type: 'receipt',
            canUse: true
          }
        ]
      },
      {
        name: '生活小工具',
        type: 'tools',
        items: [
          {
            name: '天气查询',
            icon: 'icon-baitian-shachenbao',
            type: 'weather',
            canUse: true
          },
          {
            name: '万年历',
            icon: 'icon-rili',
            type: 'calendar',
            canUse: true
          },
          {
            name: '每日笑话',
            icon: 'icon-kaixin-',
            type: 'jokes',
            canUse: true
          },
          {
            name: '域名查询',
            icon: 'icon-yuming',
            type: 'domain',
            canUse: true
          },
          {
            name: '中英交流',
            icon: 'icon-fanyi',
            type: 'communication',
            canUse: true
          },
          {
            name: '语音记账',
            icon: 'icon-historical_activity_amount',
            type: 'payments',
            canUse: true
          }
        ]

      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  redirectto(event) {
    const currentTarget = event.currentTarget;
    console.log(currentTarget);
    if (currentTarget.dataset && currentTarget.dataset.type) {
      const top = currentTarget.dataset.top;
      const type = currentTarget.dataset.type;
      const canUse = currentTarget.dataset.can;
      const name = currentTarget.dataset.name;
      if (!canUse) {
        wx.showToast({
          title: '开发中'
        });
        return;
      }
      if ((top !== 'images' && top !== 'words') || type === 'face_compare') {
        wx.navigateTo({
          url: '../' + type + '/' + type
        })
        return;
      }
      wx.navigateTo({
        url: '../' + top + '/' + top + '?type=' + type + '&name=' + name
      })
    }
  }
})
