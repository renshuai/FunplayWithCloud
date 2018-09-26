// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'funplay-be776d'
})
const db = cloud.database({
  env: 'funplay-be776d'
});

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('payments').add({
      data: event.payment
    })
  } catch(e) {
    console.error(e);
  }
}