const util = require('../../utils/util')
const db = require('../../utils/db')
const app = getApp()
const myFav = 0
const mySubmitted = 1

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo:"",
    myFav:1
  },
  onTapLogin(event) {
    let userInfo = event.detail.userInfo
    
    this.setData({
      userInfo: userInfo,
    })
    app.globalData.userInfo =  userInfo
  },
  onTapFav:function(){
    wx.navigateTo({
      url: '../fav-submitted-review/fav-submitted-review?title=' + myFav,
    })
  },
  onTapSubmitted: function () {
    wx.navigateTo({
      url: '../fav-submitted-review/fav-submitted-review?title=' + mySubmitted,
    })
  },
  backToHome(){
    util.backToHome()
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
  
})