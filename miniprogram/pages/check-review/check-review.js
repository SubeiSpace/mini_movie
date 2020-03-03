// pages/check-review/check-review.js
const cloud = require('../../utils/cloud.js')
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    const id = options.id
    this.setData({
      id
    })

    wx.startPullDownRefresh()
  },

  onPullDownRefresh: function () {
    this.fetchReview()
  },

  fetchReview: function(){
    const id = this.data.id
    cloud.db().fetchReview(id).then(({result}) => {
      wx.stopPullDownRefresh()
        const {review} = result
        console.log(review)
        this.setData({
          review
        })
    }).catch(error => {
      wx.stopPullDownRefresh()
    })
  },
  audioPlay: function(event){
    const id = event.target.id

    var tempSound = util.midstr(id)
    console.log(tempSound)

    wx.playBackgroundAudio({
      dataUrl: tempSound,
    })

  },
  backToStart: function(){
    wx.reLaunch({
      url: '/pages/start/start',
    })
  },
  toRecommend: function(event){
    console.log(event)
    const id = event.currentTarget.id
    const openId = event.currentTarget.dataset.openid
    wx.navigateTo({
      url: `/pages/recommend/recommend?id=${id}&openId=${openId}`, 
    })
  }
  
})