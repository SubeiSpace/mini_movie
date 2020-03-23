const util = require('../../utils/util')
const db = require('../../utils/db')
const app = getApp()

const titleMap = ['我的收藏', '我的发布']
const myFav = 0
const mySubmitted = 1

Page({

  /**
   * Page initial data
   */
  data: {
    barTitle:"我的收藏",
    reviewList: [],
    textType: app.globalData.textType,
    voiceType: app.globalData.voiceType,
    imagesUrl:"/images/voice-icon.gif"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let typeid = options.title
    //set navigation bar title
    let title = titleMap[typeid]
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      barTitle: title
    })
    if (typeid == myFav){
      //获取我的收藏影评列表
      wx.showLoading({
        title: 'Loading...',
      })
      db.getFavReviewListViaUser().then(result=>{
        wx.hideLoading()
        const favData = result.result
        if (favData){
          wx.showToast({
            title: 'Succeed',
          })
        }
        
        let reviewIdList = []
        for (let i = 0; i < favData.length;i++){
          reviewIdList.push(favData[i].reviewid)
        }
        //根据review id list获取review列表
        db.getReviewListViaIdList(reviewIdList).then(reviewResult => {
          const reviewData = reviewResult.result
          this.setData({
            reviewList: reviewData
          })
          this.setFilmInfo(reviewData)
        })
      })
    }else{
      wx.showLoading({
        title: 'Loading...',
      })
      db.getSubmittedReviewList().then(result => {
        wx.hideLoading()
        const reviewData = result.result
        console.log(result)
        if (reviewData) {
          wx.showToast({
            title: 'Succeed',
          })
        }
        this.setData({
          reviewList: reviewData
        })
        this.setFilmInfo(reviewData)
      })
    }
  },
  //为影评列表设置对应的电影详情
  setFilmInfo(reviewData){
    if (!reviewData){
      return false;
    }

    let filmIdList = []
    for (let i = 0; i < reviewData.length; i++) {
      filmIdList.push(reviewData[i].filmid)
    }
    db.getFilmListViaIdList(filmIdList).then(filmResult => {
      const filmList = filmResult.result
      //将电影详情加入到reviewList中
      let reviewList = this.data.reviewList
      for (let i = 0; i < reviewList.length; i++) {
        let filmid = reviewList[i].filmid
        for (let j = 0; j < filmList.length; j++) {
          if (filmid === filmList[j]._id) {
            this.setData({
              ['reviewList[' + i + '].filmname']: filmList[j].filmname,
              ['reviewList[' + i + '].imageurl']: filmList[j].imageurl,
            })
          }
        }
      }
    })
  },
  //录音播放
  // recordingAndPlaying: function (eve) {
  //   let tempsound = eve.currentTarget.dataset.soundid
  //   wx.playBackgroundAudio({
  //     //播放地址
  //     dataUrl: tempsound
  //   })
  // },
  redirectToReviewDetails: function (eve){
    let id = eve.currentTarget.dataset.id
    wx.navigateTo({
      url: '../film-comment-details/film-comment-details?id='+id,
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