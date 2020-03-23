// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const reviewIdList = event.reviewIdList


  const reviewRes = await db.collection("review").where({
    _id: _.in(reviewIdList)
  }).get()

  const review = reviewRes.data
  return review
}