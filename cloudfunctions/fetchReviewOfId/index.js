// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id
  const openId = event.openId ? event.openId : wxContext.OPENID

  const reviewRes = await db.collection("review").where({openId, id}).get()

  const review = reviewRes.data
  review.map(it => {
    it.isTheUser = it.openId == wxContext.OPENID ? true : false

    return it
  })

  return {review}
}