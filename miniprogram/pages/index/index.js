const util = require('../../utils/webhelper')
const db = require('../../utils/cloud-functions')
const app = getApp()

Page({

  data: {
    filmDetails:{},
    review:{},
    noReview: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'Loading...',
    })
    db.getRandomFilm().then(result => {
      wx.hideLoading()
      const filmData = result.data[0]
      if (filmData) {
        this.setData({
          filmDetails: filmData
        })
      }
    })
    
    let filmid = this.data.filmDetails._id
    db.getRandomReview(filmid).then(result => {
      wx.hideLoading()
      const reviewData = result.data[0]
      if (reviewData) {
        console.log(reviewData);
        this.setData({
          review: reviewData,
          noReview:false
        })
      }
    })
  },
 // 跳转到详情页面
  openFilmDetails:function(){
    wx.navigateTo({
      url: '../film/film-details/film-details?id=' + this.data.filmDetails._id,
    })
  },
  openCommentDetails: function () {
    console.log("开始打开评论详情")
    if (this.data.review._id != undefined){
      wx.navigateTo({
        url: '../film/film-comment-details/film-comment-details?id=' + this.data.review._id,
      })
    }
    
  },
  redirectToFilmList: function () {
    wx.redirectTo({
      url: '../film/film-list/film-list',
    })
  },
  redirectToMe: function () {
    wx.redirectTo({
      url: '../my/my-info/my-info',
    })
  },

})