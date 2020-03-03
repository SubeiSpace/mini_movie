// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const id = event.id

  const reviewRes = await db.collection('review').where({openId, id}).get()

  const data = reviewRes.data

  return { data }
}