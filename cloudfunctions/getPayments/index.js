// 云函数入口文件
const cloud = require('wx-server-sdk')
const app = getApp()

cloud.init()
cloud.init({
  env: app.globalData.env
})
const db = cloud.database({
  env: app.globalData.env
});

// 云函数入口函数
exports.main = async (event, context) => {
  const openId = event.userInfo.openId;
  return await db.collection('payments').where({
    _openid: openId
  }).get({
    success: res => {
      console.log(res);
    }
  })
}