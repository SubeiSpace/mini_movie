// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  const params = event.res
  const userOpenId = event.userOpenId ? event.userOpenId : openId //true: 收藏的用户Openid, false: 自己的openId

  const collectionRes = await db.collection('collection').add({
    data:{
      openId,
      id: params.id,
      image: params.image,
      name: params.name,
      review: params.review,
      soudUrl: params.soudUrl,
      user: params.user,
      recordingTime: params.recordingTime,
      userOpenId
    }
  })

  const collection = collectionRes.data

  return { collection}
}