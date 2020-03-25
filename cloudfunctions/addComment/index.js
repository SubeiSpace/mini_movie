// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  await db.collection('review').add({
    data: {
      user: openid,
      username: event.username,
      avatar: event.avatar,
      content: event.content,
      filmid: event.filmId,
      type: event.type,
      createtime: +new Date(),
      time: event.time
    },
  })

  return {}
}