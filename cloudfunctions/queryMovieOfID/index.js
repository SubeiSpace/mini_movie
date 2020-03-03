// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const _id = event.id

  const movieRes = await db.collection("movies").doc(_id).get()
  const movie = movieRes.data

  return movie
}