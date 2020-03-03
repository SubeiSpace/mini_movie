const cloud = require('./cloud.js')
const cloudUrl = "https://6d69-mini-movie-gi442-1301236199.tcb.qcloud.la/sounds"

/**
 * 用户模块
 */
const user = () =>{
  return {
    //获取本地用户存储信息
    getCurrentUser :() => wx.getStorageSync('user'),
    //获取微信帐号信息
    signIn: () => new Promise((reslove, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo'] == false) {
            reject()
          } else {
            wx.getUserInfo({
              success: res => {
                const {userInfo} = res;
            
                reslove({user: userInfo })
              }
            })
          }
        }
      })
    }),

    cloudUser: () => new Promise((reslove, reject) => {
      user().signIn().then(({ user }) => {
        cloud.db().queryUser().then(({ result }) => { //查询云端是否已有此用户
          if (result.length == 0) { //没有此用户，添加到云端
            cloud.db().login(user).then(({ result }) => {
              const {openId} = result
              reslove({user, openId})
            })
          }else{
            const {openId} = result[0]
            reslove({user, openId})
          }
        })
      })
    }),

    fetchUser: () => new Promise((reslove, reject) => {
      user().cloudUser().then(({user, openId}) => {
        console.log(user)
        wx.setStorage({
          key: 'user',
          data: user
        })

        reslove({user})
      })
    })
  }
}

  
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day, hour, minute, second].map(formatNumber).join("")
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const midstr = (str) => {
  var strnum = str.lastIndexOf('/')
  var ministr = str.substr(strnum)
  return cloudUrl + ministr
}





module.exports = {
  cloudUrl,
  user,
  formatDate,
  midstr
}