//index.js
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
//获取应用实例
const app = getApp()
const md5 = require('../../utils/MD5.js');
Page({
  data: {
    currentText: '',
    translateText: '',
    speechLanguages: [
      {
        lang: 'zh',
        name: '中文',
      },
      {
        lang: 'en',
        name: '英语'
      }
    ],
    allLanguages: [
      {
        lang: 'zh',
        name: '中文'
      },
      {
        lang: 'en',
        name: '英语'
      },
      {
        lang: 'yue',
        name: '粤语'
      },
      {
        lang: 'wyw',
        name: '文言文'
      },
      {
        lang: 'jp',
        name: '日语'
      },
      {
        lang: 'kor',
        name: '韩语'
      },
      {
        lang: 'fra',
        name: '法语'
      },
      {
        lang: 'spa',
        name: '西班牙语'
      },
      {
        lang: 'th',
        name: '泰语'
      },
      {
        lang: 'ara',
        name: '阿拉伯语'
      },
      {
        lang: 'ru',
        name: '俄语'
      },
      {
        lang: 'pt',
        name: '葡萄牙语'
      },
      {
        lang: 'de',
        name: '德语'
      },
      {
        lang: 'it',
        name: '意大利语'
      },
      {
        lang: 'el',
        name: '希腊语'
      },
      {
        lang: 'nl',
        name: '荷兰语'
      },
      {
        lang: 'pl',
        name: '波兰语'
      },
      {
        lang: 'bul',
        name: '保加利亚语'
      },
      {
        lang: 'est',
        name: '爱沙尼亚语'
      },
      {
        lang: 'dan',
        name: '丹麦语'
      },
      {
        lang: 'fin',
        name: '芬兰语'
      },
      {
        lang: 'cs',
        name: '捷克语'
      },
      {
        lang: 'rom',
        name: '罗马尼亚语'
      },
      {
        lang: 'slo',
        name: '斯洛文尼亚语'
      },
      {
        lang: 'swe',
        name: '瑞典语'
      },
      {
        lang: 'hu',
        name: '匈牙利语'
      },
      {
        lang: 'cht',
        name: '繁体中文'
      },
      {
        lang: 'vie',
        name: '越南语'
      }
    ],
    translateLanguages: [
      {
        lang: 'en',
        name: '英语'
      },
      {
        lang: 'yue',
        name: '粤语'
      },
      {
        lang: 'wyw',
        name: '文言文'
      },
      {
        lang: 'jp',
        name: '日语'
      },
      {
        lang: 'kor',
        name: '韩语'
      },
      {
        lang: 'fra',
        name: '法语'
      },
      {
        lang: 'spa',
        name: '西班牙语'
      },
      {
        lang: 'th',
        name: '泰语'
      },
      {
        lang: 'ara',
        name: '阿拉伯语'
      },
      {
        lang: 'ru',
        name: '俄语'
      },
      {
        lang: 'pt',
        name: '葡萄牙语'
      },
      {
        lang: 'de',
        name: '德语'
      },
      {
        lang: 'it',
        name: '意大利语'
      },
      {
        lang: 'el',
        name: '希腊语'
      },
      {
        lang: 'nl',
        name: '荷兰语'
      },
      {
        lang: 'pl',
        name: '波兰语'
      },
      {
        lang: 'bul',
        name: '保加利亚语'
      },
      {
        lang: 'est',
        name: '爱沙尼亚语'
      },
      {
        lang: 'dan',
        name: '丹麦语'
      },
      {
        lang: 'fin',
        name: '芬兰语'
      },
      {
        lang: 'cs',
        name: '捷克语'
      },
      {
        lang: 'rom',
        name: '罗马尼亚语'
      },
      {
        lang: 'slo',
        name: '斯洛文尼亚语'
      },
      {
        lang: 'swe',
        name: '瑞典语'
      },
      {
        lang: 'hu',
        name: '匈牙利语'
      },
      {
        lang: 'cht',
        name: '繁体中文'
      },
      {
        lang: 'vie',
        name: '越南语'
      }
    ],
    speechIndex: 0,
    translateIndex: 0
  },
  onLoad: function () {
    this.initRecord();
  },
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      console.log(res);
      let text = res.result
      this.setData({
        currentText: text,
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
        currentText: text
      })
      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  streamRecord: function () {
    this.setData({
      currentText: '',
      translateText: ''
    });
    const speechLang = this.data.speechLanguages[this.data.speechIndex]['lang'];
    manager.start({
      lang: (speechLang === 'zh') ? 'zh_CN' : 'en_US'
    })
  },
  streamRecordEnd: function () {
    manager.stop()
  },
  translateTextAction() {
    const speechLang = this.data.speechLanguages[this.data.speechIndex]['lang'];
    const translateLang = this.data.translateLanguages[this.data.translateIndex]['lang'];
    let lfrom = (speechLang === 'zh') ? 'zh_CN' : 'en_US';
    if (translateLang === 'zh' || translateLang === 'en') {
      let lto = (translateLang === 'en') ? 'en_US' : 'zh_CN';
      plugin.translate({
        lfrom: lfrom,
        lto: lto,
        content: this.data.currentText,
        tts: true, // 需要合成语音
        success: (resTrans) => {
          // 翻译可以得到 翻译文本，翻译文本的合成语音，合成语音的过期时间
          let text = resTrans.result
          this.setData({
            translateText: text,
          })
          // 得到合成语音让它自动播放出来
          wx.playBackgroundAudio({
            dataUrl: resTrans.filename,
            title: ''
          })
        },
      })
    } else {
      // 微信暂不支持别的语种的翻译，使用百度翻译
      const appid = app.globalData['fanyi_appid'];
      const q = this.data.currentText;
      const salt = (new Date).getTime();
      const key = app.globalData['fanyi_key'];
      const str = '' + appid + q + salt + key;
      const sign = md5.md5(str);
      let param = {
        q: q,
        from: this.data.speechLanguages[this.data.speechIndex]['lang'],
        to: this.data.translateLanguages[this.data.translateIndex]['lang'],
        appid: appid,
        salt: salt,
        sign: sign
      }
      console.log(param);
      wx.request({
        url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        data: param,
        success: response => {
          console.log(response);
          if (response.statusCode === 200 && response.data && response.data['trans_result']) {
            const result = response.data['trans_result'];
            let translateText = '';
            for (let key in result) {
              translateText += result[key]['dst'];
            }
            this.setData({
              translateText: translateText
            });
          }
        }
      })
    }
    
  },
  translateLangChange(event) {
    this.setData({
      translateIndex: event.detail.value
    })
  },
  speechLangChange(event) {
    const value = event.detail.value;
    // 翻译语种不能包含当前录音语种
    this.setData({
      speechIndex: value,
      translateLanguages: this.data.allLanguages.filter(item => {
        return item.lang !== this.data.speechLanguages[value]['lang']
      })
    })
  },
  // 语种切换
  revert() {
    let speechIndex = -1;
    // 判断是否包含该翻译语种
    const isContain = this.data.speechLanguages.some((item,index) => {
      // 记录翻译语种在录音语种中的位置
      if (item.lang === this.data.translateLanguages[this.data.translateIndex]['lang']) {
        speechIndex = index;
      }
      return item.lang === this.data.translateLanguages[this.data.translateIndex]['lang'];
    })
    if (isContain) {
      const translateLanguages = this.data.allLanguages.filter(item => {
        return item.lang !== this.data.speechLanguages[speechIndex]['lang'];
      })
      let translateIndex = -1;
      translateLanguages.forEach((item, index) => {
        if (item.lang === this.data.speechLanguages[this.data.speechIndex]['lang']) {
          translateIndex = index;
        }
      })
      if (speechIndex > -1 && translateIndex > -1) {
        this.setData({
          speechIndex: speechIndex,
          translateLanguages: translateLanguages,
          translateIndex: translateIndex
        })
      } else {
        wx.showToast({
          title: '对调出错'
        })
      }
    } else {
      wx.showToast({
        title: this.data.translateLanguages[this.data.translateIndex]['name'] + '不支持'
      })
    }
  }
})
