const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
const app = getApp()
const {chineseToNumber} = require('../../utils/chineseToNumber.js')


Page({
  data: {
    payments: [],
    speechText: '',

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
  submit() {
    const db = wx.cloud.database({
      env: app.globalData.env
    })
    console.log(app.globalData.openid, 'openid');
    db.collection('payments').add({
      data: {
        'type': this.data.type,
        'cash': this.data.cash,
        'description': this.data.description,
        '_openid': app.globalData.openid
      }
    }).then(res => {
      console.log(res);
    })
    // wx.cloud.callFunction({
    //   name: 'add',
    //   data: {
    //     'type': this.data.type,
    //     'cash': this.data.cash,
    //     'description': this.data.description
    //   }
    // }).then(response => {
    //   console.log(response);
    // })
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
  },
  streamRecord: function () {
    this.setData({
      speechText: ''
    });
    manager.start({
      lang: 'zh_CN'
    })
  },
  streamRecordEnd: function () {
    manager.stop()
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
    let typesObj = {
      'canyin': {
        keywords: ['吃饭','火锅', '麻辣烫','聚餐'],
        icon: '',
        name: '餐饮'
      },
      'gouwu': {
        keywords: ['超市','衣服','化妆品','京东','淘宝','天猫'],
        icon: '',
        name: '购物'
      },
      'jiaotong': {
        keywords: ['公交','一卡通','地铁','飞机','机票','火车','共享单车','租车'],
        icon: '',
        name: '交通'
      },
      'yule': {
        keywords: ['KTV','唱歌','酒吧','网吧','嗨','旅游'],
        icon: '',
        name: '娱乐'
      },
      'yiyao': {
        keywords: ['医','药','医院','挂号','生病','买药','住院'],
        icon: '',
        name: '医药'
      },
      'jujia': {
        keywords: ['买菜','居家'],
        icon: '',
        name: '居家'
      },
      'touzi': {
        keywords: ['理财','股票','基金','证券','银行'],
        icon: '',
        name: '投资'
      },
      'renqing': {
        keywords: ['红包','借钱', '还钱','份子钱','随礼','礼品'],
        icon: '',
        name: '人情'
      }
    }
    let payment = null;
    for (let key in typesObj) {
      const keywords = typesObj[key]['keywords'];
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
    const db = wx.cloud.database({
      env: app.globalData.env
    })
    db.collection('payments').add({
      data: payment,
      success: function (res){
        console.log(response);
        const payments = JSON.parse(JSON.stringify(self.data.payments));
        payments.push(payment);
        self.setData({
          payments: payments
        })
      },
      fail: function(error) {
        console.log(error);
      }
    })
    // wx.cloud.callFunction({
    //   name: 'add',
    //   data: {
    //     payment: payment
    //   }
    // }).then(response => {
    //   console.log(response);
    //   const payments = JSON.parse(JSON.stringify(this.data.payments));
    //   payments.push(payment);
    //   this.setData({
    //     payments: payments
    //   })
    // })
  }
})