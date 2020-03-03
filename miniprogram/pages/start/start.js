// miniprogram/pages/start/start.js
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')

Page({

  data: {
    recommend: null,
    user: util.user().getCurrentUser() || null
  },

 
  onLoad: function (options) {
  },

  onShow(){
    this.fetchAllReview()
  },

  //获取所有的影评信息
  fetchAllReview: function(){
    const user = util.user().getCurrentUser() || null
    console.log(user)
    if(!user) {
      return
    }

    cloud.db().fetchAllReview().then(({data}) => {
      const length = data.length

      if(data.length != 0){
       const number = Math.floor(Math.random() * length) //取随机数
       const recommend = data[number]
       console.log(recommend)
       this.setData({
        user: user,
        recommend,
        recommendImage : recommend.image
       })
      }
    })
  },

    /**
     * 微信用户授权,获取用户信息
     * 判定云端是否存在此用户，不存在则添加到云端
     * 本地存储
     */
  onGotUserInfo: function(event){
    util.user().fetchUser().then(({user}) => {
      console.log(user)
  
      this.setData({
        user
      })
      this.fetchAllReview()
    }).catch(error =>{

    })
  },
  //图片加载失败，使用默认图片
  errorLoaded(event){
    this.setData({
      recommendImage : '/images/default.png'
    })
  },

  //推荐跳转，影评ID
  recommend: function(event){
    console.log(event)
    const id = event.currentTarget.id
    wx.navigateTo({
      url: `/pages/recommend/recommend?id=${id}&openId=${this.data.recommend.openId}`,
    })
  },
  //热门 点击事件
  toHotHandle: function(){
    wx.navigateTo({
      url: '/pages/hot/hot',
    })
  },
  //我的 点击事件
  toMineHandle: function(){
    wx.navigateTo({
      url: '/pages/mine/mine',
    })
  },
  toDetail: function(event){
    console.log(event)
    const id = event.target.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`,
    })
  }
 
})