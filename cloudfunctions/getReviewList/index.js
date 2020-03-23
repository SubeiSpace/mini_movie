// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id
  
  const reviewRes = await db.collection('review').where({
    filmid: id
  }).get()

  const reviewDetails = reviewRes.data

  return reviewDetails
}