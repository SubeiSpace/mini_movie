// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  const addReviewRes = await db.collection("review").add({
    data:{
      openId,
      id: event.id,
      image: event.image,
      name: event.name,
      user: event.user,
      review: event.review,
      soudUrl: event.soudUrl,
      recordingTime: event.recordingTime
    }
  })

  return {}
}