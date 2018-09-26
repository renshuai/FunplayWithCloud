//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    latitude: 39.9110666857,
    longitude: 116.4136103013,
    city: '北京市',
    hasPositionChange: false, // 是否手动修改了地址
    markers: [{
      id: 1,
      latitude: 39.9110666857,
      longitude: 116.4136103013,
      name: ''
    }],
    scale: 12,
    weatherShow: false,
    weatherInfo: null,
    timeout: null,
    lifeStyleObj: {
      ac: "空调开启指数",
      ag: "过敏指数",
      air: "空气污染扩散条件指数",
      airc: "晾晒指数",
      comf: "舒适度指数",
      cw: "洗车指数",
      drsg: "穿衣指数",
      fisin: "钓鱼指数",
      flu: "感冒指数",
      gl: "太阳镜指数",
      mu: "化妆指数",
      ptfc: "交通指数",
      spi: "防晒指数",
      sport: "运动指数",
      trav: "旅游指数",
      uv: "紫外线指数"
    }

  },
  onLoad: function (options) {
  },
  onReady() {
    this.mapCtx = wx.createMapContext('myMap');
    const self = this;
    wx.getLocation({
      success: function(res) {
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        }, function () {
          self.getDetailPosition(res).then(response => {
            if (response.data && response.data.status === 0) {
              const district = response.data.result.address_component.district;
              self.setData({
                city: district
              })
            }
          });
          self.translateMarker(res);
        })
      },
    })
    // this.mapCtx.moveToLocation();
    // this.getCenterLocation();
  },
  getCenterLocation: function () {
    const self = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        self.translateMarker(res);
        self.getDetailPosition(res).then(response => {
          if (response.data && response.data.status === 0) {
            const district = response.data.result.address_component.district;
            self.setData({
              city: district
            })
          }
        });
      }
    })
  },
  translateMarker: function (res) {
    // this.mapCtx.translateMarker({
    //   markerId: 1,
    //   autoRotate: false,
    //   duration: 1,
    //   destination: {
    //     latitude: res.latitude,
    //     longitude: res.longitude,
    //   },
    //   animationEnd() {
    //     console.log('animation end')
    //   }
    // })
    // this.setData({
    //   'markers[0].latitude': res.latitude,
    //   'markers[0].longitude': res.longitude
    // })
    this.setData({
      markers: [{
        id: 1,
        latitude: res.latitude,
        longitude: res.longitude,
        name: ''
      }]
    })
  },
  regionChange(event, causeBy) {
    console.log(event);
    // if (this.data.timeout) {
    //   clearTimeout(this.data.timeout);
    //   this.setData({
    //     timeout: null
    //   })
    // } else {
    //   this.setData({
    //     timeout: setTimeout(_ => {
    //       this.getCenterLocation();
    //     }, 100)
    //   })
    // }
    if (event.type === 'end') {
      this.getCenterLocation();
    }
  },
  getDetailPosition(obj) {
    return new Promise((resolve, reject) => {
      const self = this;
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + obj.latitude + ',' + obj.longitude + '&key=NI2BZ-RZFCP-A4DD7-LNHD4-YTVAO-DJFGY&get_poi=1',
        success: res => {
          resolve(res);
        },
        fail: msg => {
          wx.showToast({
            title: msg
          })
        }
      })
    })
  },
  getWeatherDetail() {
    // this.getWeatherDetail();
    wx.request({
      url: 'https://www.sojson.com/open/api/weather/json.shtml?city=' + this.data.city,
      success: res => {
        if (res.data && res.data.status === 200) {
          let data = res.data.data;
          data.forecast.forEach(item => {
            let icon = { 
              '阵雨': 'iconfont icon-baitian-zhongyu',
              '雷阵雨': 'iconfont icon-baitian-zhongyu',
              '小雨': 'iconfont icon-baitian-xiaoyu',
              '中雨': 'iconfont icon-baitian-zhongyu',
              '小到中雨': 'iconfont icon-baitian-zhongyu',
              '大雨': 'iconfont icon-baitian-dayu',
              '小雪': 'iconfont icon-baitian-xiaoxue',
              '中雪': 'iconfont icon-baitian-zhongxue',
              '大雪': 'iconfont icon-baitian-daxue',
              '雷': 'iconfont icon-baitian-lei',
              '阴': 'iconfont icon-baitian-duoyun',
              '多云': 'iconfont icon-baitian-duoyun',
              '晴': 'iconfont icon-baitian-qing',
              '晴转多云': 'iconfont icon-baitian-duoyunzhuanqing',
              '冰雹': 'iconfont icon-baitian-bingbao',
              '沙尘暴': 'iconfont icon-baitian-shachenbao',
              '雾霾': 'iconfont icon-baitian-wumai'
            }[item.type];
            if (!icon) {
              wx.showToast({
                title: item.type
              })
              icon = 'icon-baitian-duoyun';
            }
            item.icon = icon;
            item.high = item.high.substring(3);
            item.low = item.low.substring(3);
          })
          console.log(data);
          this.setData({
            weatherInfo: res.data.data,
            weatherShow: true
          })
        }
      },
      fail: error => {
        console.log(error);
      }
    })
  },
  getWeatherInfo() {
    let url = 'https://free-api.heweather.com/s6/weather?';
    const location = this.data.longitude + ',' + this.data.latitude;
    const key = '51a83722093f48faa90156e1daa07fbc';
    url += 'location=' + location + '&key=' + key;
    wx.request({
      url: url,
      method: 'GET',
      success: response => {
        if (response.statusCode === 200 && response.data.HeWeather6) {
          let HeWeather6 = response.data.HeWeather6;
          if (HeWeather6.length) {
            HeWeather6.forEach(weather => {
              let daily_forecast = weather['daily_forecast'];
              if (daily_forecast.length) {
                daily_forecast.forEach(item => {
                  let icon = {
                    '阵雨': 'iconfont icon-baitian-zhongyu',
                    '雷阵雨': 'iconfont icon-baitian-zhongyu',
                    '小雨': 'iconfont icon-baitian-xiaoyu',
                    '中雨': 'iconfont icon-baitian-zhongyu',
                    '小到中雨': 'iconfont icon-baitian-zhongyu',
                    '大雨': 'iconfont icon-baitian-dayu',
                    '小雪': 'iconfont icon-baitian-xiaoxue',
                    '中雪': 'iconfont icon-baitian-zhongxue',
                    '大雪': 'iconfont icon-baitian-daxue',
                    '雷': 'iconfont icon-baitian-lei',
                    '阴': 'iconfont icon-baitian-duoyun',
                    '多云': 'iconfont icon-baitian-duoyun',
                    '晴': 'iconfont icon-baitian-qing',
                    '晴转多云': 'iconfont icon-baitian-duoyunzhuanqing',
                    '冰雹': 'iconfont icon-baitian-bingbao',
                    '沙尘暴': 'iconfont icon-baitian-shachenbao',
                    '雾霾': 'iconfont icon-baitian-wumai'
                  }[item.cond_txt_d];
                  if (!icon) {
                    wx.showToast({
                      title: item.type
                    })
                    icon = 'icon-baitian-duoyun';
                  }
                  item.icon = icon;
                  item.date = item.date.split('-').slice(1).join('-')
                })
              }
            }) 
            this.setData({
              weatherInfo: HeWeather6[0],
              weatherShow: true
            })
          }
        }
      }

    })
  },
  closeResult() {
    this.setData({
      weatherShow: false
    })
  },
  inputChange(event) {
    this.setData({
      city: event.detail.value,
      hasPositionChange: true
    })
  },
  inputBlur(event) {
    this.setData({
      city: event.detail.value,
      hasPositionChange: true
    })
  },
  queryWeather() {
    // 查询地图中所属区域是否与输入位置相符，不相符，需要地图移动到特定位置
    const position = {
      latitude: this.data.markers[0].latitude,
      longitude: this.data.markers[0].longitude
    }
    // this.mapCtx.getScale({
    //   success: res => {
    //     this.setData({
    //       scale: res.scale
    //     })
    //   }
    // })
    // 先判断是否手动修改了地址，修改了则需要移动地图，否则直接查询天气就行
    
    console.log(this.data.hasPositionChange);
    if (!this.data.hasPositionChange) {
      // 记下当前中心点位置，查询完天气后地图显示时直接显示该位置
      this.setData({
        latitude: this.data.markers[0].latitude,
        longitude: this.data.markers[0].longitude
      }, _ => {
        this.getWeatherInfo();
      })
    } else {
      // 地图需要移动到当前查询城市, 首先需要获取到输入城市的地理坐标
      this.getPositionCoordinate(this.data.city).then(response => {
        if (response.data && response.data.status === 0) {
          const result = response.data.result;
          // 记下当前中心点位置，查询完天气后地图显示时直接显示该位置
          this.setData({
            latitude: result.location.lat,
            longitude: result.location.lng,
            hasPositionChange: false
          }, _ => {
            this.getWeatherInfo();
          })
          // marker点也移动到对应位置
          this.translateMarker({
            latitude: result.location.lat,
            longitude: result.location.lng
          })
        } else {
          wx.showToast({
            title: response.data.message
          })
        }
      });
    }
  },
  // 根据实际地名获取地理坐标信息
  getPositionCoordinate(place) {
    const url = 'https://apis.map.qq.com/ws/geocoder/v1/?address=' + place + '&key=' + 'NI2BZ-RZFCP-A4DD7-LNHD4-YTVAO-DJFGY';
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: res => {
          resolve(res);
        },
        fail: error => {
          wx.showToast({
            title: error
          })
        }
      })
    })
  }
})
