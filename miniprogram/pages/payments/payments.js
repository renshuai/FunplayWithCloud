const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
const app = getApp()
const {chineseToNumber} = require('../../utils/chineseToNumber.js')
const util = require('../../utils/util.js');


Page({
  data: {
    payments: [],
    speechText: '',
    typesObj: {
      'canyin': {
        keywords: ['吃饭', '火锅', '麻辣烫', '聚餐'],
        icon: '',
        name: '餐饮'
      },
      'gouwu': {
        keywords: ['超市', '衣服', '化妆品', '京东', '淘宝', '天猫'],
        icon: 'icon-gouwu1',
        name: '购物'
      },
      'jiaotong': {
        keywords: ['公交', '一卡通', '地铁', '飞机', '机票', '火车', '共享单车', '租车'],
        icon: 'icon-jiaotongyunshu',
        name: '交通'
      },
      'yule': {
        keywords: ['KTV', '唱歌', '酒吧', '网吧', '嗨', '旅游'],
        icon: 'icon-yule',
        name: '娱乐'
      },
      'yiyao': {
        keywords: ['医', '药', '医院', '挂号', '生病', '买药', '住院'],
        icon: 'icon-medical',
        name: '医药'
      },
      'jujia': {
        keywords: ['买菜', '居家'],
        icon: 'icon-jujia',
        name: '居家'
      },
      'touzi': {
        keywords: ['理财', '股票', '基金', '证券', '银行'],
        icon: 'icon-38',
        name: '投资'
      },
      'renqing': {
        keywords: ['红包', '借钱', '还钱', '份子钱', '随礼', '礼品'],
        icon: 'icon-hongbao',
        name: '人情'
      },
      'other': {
        keywords: ['其他', '其它'],
        icon: 'icon-icon-test',
        name: '其他'
      }
    },
    showModal: false,
    touchIndex: '-1',
    startClientX: 0,
    startClentY: 0
  },
  onLoad() {
    this.initRecord();
    this.getData();
  },
  getData() {
    const db = wx.cloud.database({
      env: app.globalData.env
    })
    db.collection('payments').get({
      success: res => {
        console.log(res);
        this.setData({
          payments: res.data
        })
      },
      fail: error => {
        console.log(error);
      }
    })
  },
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        speechText: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if (text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      this.setData({
        speechText: text
      })
      // 得到完整识别内容就可以去翻译了
      this.analyzeText()
    }

    // 识别出错
    manager.onError = (error) => {
      this.setData({
        showModal: false
      }, _ => {
        wx.showToast({
          title: error.msg
        })
      })
    }
  },
  streamRecord: function () {
    this.setData({
      speechText: '',
      showModal: true
    });
    manager.start({
      lang: 'zh_CN'
    })
  },
  streamRecordEnd: function () {
    this.setData({
      showModal: false
    }, _ => {
      manager.stop()
    })
  },
  analyzeText() {
    let self = this;
    const speechText = this.data.speechText;
    const regNumber = /\d{1,}/g;
    const regChineseNumebr = /[零一二三四五六七八九十百千万亿]{1,}/g;
    // 先直接匹配数字
    let number = speechText.match(regNumber);
    // 匹配不上数字后直接匹配汉字的数字
    if (!number) {
      let str = speechText.match(regChineseNumebr);
      if (str) {
        number = chineseToNumber(str[0]);
      }
    } else {
      number = number[0];
    }
    
    let payment = null;
    for (let key in this.data.typesObj) {
      const keywords = this.data.typesObj[key]['keywords'];
      const isContain = keywords.some(item => {
        return speechText.includes(item);
      })
      if (isContain) {
        payment = {
          type: key,
          cash: number || '未知',
          description: this.data.speechText
        };
        break;
      }
    }
    if (!payment) {
      payment = {
        type: 'other',
        cash: number,
        description: this.data.speechText
      }
    }
    payment.date = util.formatTime(new Date());
    const db = wx.cloud.database({
      env: app.globalData.env
    })
    db.collection('payments').add({
      data: payment,
      success: function (res){
        self.getData();
      },
      fail: function(error) {
        console.log(error);
      }
    })
  },
  touchStart(event) {
    const touches = event.touches;
    if (touches.length) {
      this.setData({
        startClientX: touches[0]['clientX'],
        startClentY: touches[0]['clientY'],
      })
    }
  },
  touchEnd(event) {
    const currentTarget = event.currentTarget;
    const changedTouches = event.changedTouches;
    if (changedTouches.length) {
      let endClientX = changedTouches[0]['clientX'];
      let endClientY = changedTouches[0]['clientY'];
      let diffX = endClientX - this.data.startClientX;
      let diffY = endClientY - this.data.startClentY;
      if (Math.abs(diffY) <= Math.abs(diffX) && diffX <= 0) {
        console.log(1);
        console.log(currentTarget.id);
        this.setData({
          touchIndex: currentTarget.id
        })
      } else {
        console.log(2);
        this.setData({
          touchIndex: '-1'
        })
      }
    }
  },
  delete() {
    const touchIndex = this.data.touchIndex;
    const db = wx.cloud.database({
      env: app.globalData.env
    })
    db.collection('payments').doc(this.data.payments[touchIndex]['_id']).remove().then(res => {
      const payments = JSON.parse(JSON.stringify(this.data.payments));
      payments.splice(this.data.touchIndex, 1);
      this.setData({
        payments: payments,
        touchIndex: '-1'
      })
    }).catch(error => {
      wx.showToast({
        title: '删除失败'
      })
    })
    
  }
})