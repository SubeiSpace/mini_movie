// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const filmIdList = event.filmIdList

  const filmRes = await db.collection("films").where({
    _id: _.in(filmIdList)
  }).get()

  const film = filmRes.data
  return film
}