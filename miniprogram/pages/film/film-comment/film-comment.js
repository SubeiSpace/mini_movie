//创建audio控件
const myaudio = wx.createInnerAudioContext();
var voice = "";
const webhelper = require('../../../utils/webhelper')
const db = require('../../../utils/cloud-functions')
const app = getApp()


Page({
  data: {
    imagesUrl: '../../images/voice-icon.gif', //图片路径,
    textType: 1,
    voiceType: 2,
    userInfo: "",
    reviewList: [],
    filmid: "",
    userId: ""
  },
  //通过电影id获取对应的影评列表信息
  getCommentList(id) {
    console.log("展示的电影id为：" + id)
    wx.showLoading({
      title: 'Loading...',
    })
    db.getCommentList(id).then(result => {
        wx.hideLoading()
        const data = result.result
        console.log(data)
        if (data) {
          this.setData({
            reviewList: data
          })
        }
      })
      wx.stopPullDownRefresh()
  },
  redirectToReviewDetails(event) {
    let id = event.currentTarget.dataset.id
    let userid = event.currentTarget.dataset.userid
    console.log("展示的影评详情id为：" + id)
    let redirectUrl = '../film-comment-details/film-comment-details?id=' + id
    if (userid === this.data.userId) {
      redirectUrl = redirectUrl + '&hiddenMyReview=false'
    }
    wx.navigateTo({
      url: redirectUrl,
    })
  },
  backToHome() {
    webhelper.backToHome()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let filmid = options.id
    this.getCommentList(options.id)
    this.getUserId()
    this.setData({
      filmid: filmid
    })
  },
  getUserId() {
    db.getUserId().then(result => {
      wx.hideLoading()
      const data = result.result
      if (data) {
        this.setData({
          userId: data.openid
        })
      }
    })
  }
})