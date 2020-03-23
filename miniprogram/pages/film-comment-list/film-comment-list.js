// miniprogram/pages/film-review-list/file-review-list.js
//创建audio控件
const myaudio = wx.createInnerAudioContext(); 
var voice = "";
const util = require('../../utils/util')
const db = require('../../utils/db')
const app = getApp()


Page({

  /**
   * Page initial data
   */
  data: {
    imagesUrl: '../../images/voice-icon.gif', //图片路径,
    textType : 1,
    voiceType :2,
    userInfo : "",
    reviewList:[],
    filmid:"",
    userId:""
  },
  //通过电影id获取对应的影评列表信息
  getReviewList(id){
    console.log("展示的电影id为："+id)
    wx.showLoading({
      title: 'Loading...',
    })
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
      db.getReviewList(id).then(result=>{
        wx.hideLoading()
        //使用此方式在我本地无法正常展示，原因是数据结构的data在result.result.data中
        //使用的开发者工具版本为Stable v1.02.1911180,Debug base library为2.10.2
        const data = result.result
        console.log(data)
        //使用以下方式在我本地显示是正常的；
        // const reviewData = result.result.data
        // console.log(reviewData)
        if(data){
          wx.showToast({
            title: 'Succeed',
          })
          this.setData({
            reviewList: data
          })
        }
      })
      
    wx.stopPullDownRefresh()
    }).catch(err => {
      console.log('未授权');
      wx.stopPullDownRefresh()
    })

  },
  redirectToReviewDetails(event) {
    let id = event.currentTarget.dataset.id
    let userid = event.currentTarget.dataset.userid
    console.log("展示的影评详情id为：" + id)
    let redirectUrl = '../film-comment-details/film-comment-details?id=' + id
    if (userid === this.data.userId){
      redirectUrl = redirectUrl + '&hiddenMyReview=false'
    }
    wx.navigateTo({
      url: redirectUrl,
    })

  },
  backToHome() {
    util.backToHome()
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let filmid = options.id
    this.getReviewList(options.id)
    this.getUserId()
    this.setData({
      filmid: filmid
    })
  },

  getUserId(){
    db.getUserId().then(result => {
      wx.hideLoading()
      const data = result.result
      if (data) {
        this.setData({
          userId: data.openid
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getReviewList(this.data.filmid)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})