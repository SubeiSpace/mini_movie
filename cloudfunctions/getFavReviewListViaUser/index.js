// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const dbCommand = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const favReviewRes = await db.collection("fav").where({
    user: user
  }).get()
  const favReviewData = favReviewRes.data

  return favReviewData
}