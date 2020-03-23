// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID

  await db.collection('films').add({
    data: {
      slotno: event.slotNo,
      imageurl: event.imageUrl,
      filmname: event.filmName,
      filmtype: event.filmType,
      description: event.description,
      createtime:new Date()
    },
  })

  return {}
}