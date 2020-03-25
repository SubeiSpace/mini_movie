const webhelper = require('../../../utils/webhelper')
const db = require('../../../utils/cloud-functions')
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    filmDetails: {},
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: "textManner", text: "文字" },
      { bindtap: "voiceManner", text: "音频" }
    ],
    userInfo: null,
    hiddenAdd: false,
    hiddenMyReview: true,
    reviewId: "",
    filmId: ""
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

  },
  addComment: function () {
    //先判断用户是否登录
    webhelper.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
    }).catch(err => {
      console.log('还没登录');
      wx.redirectTo({
        url: '../../my/my-info/my-info',
      })
    })
  },
  actionSheetBindChange: function () {
    actionSheetHidden: !this.data.actionSheetHidden
  },
  bindtextManner: function () {
    this.setData({
      selectedManner: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })

    wx.navigateTo({
      url: '../film-comment-edit/film-comment-edit?reviewtype=' + app.globalData.textType + '&filmid=' + this.data.filmDetails._id,
    })


  },
  bindvoiceManner: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.navigateTo({
      url: '../film-comment-edit/film-comment-edit?reviewtype=' + app.globalData.voiceType + '&filmid=' + this.data.filmDetails._id,
    })
  },
  onLoad: function (options) {
    let id = options.id
    this.getFilmDetails(id)
    this.setDisplayReviewButton(id)
  },
  onShow() {
    webhelper.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('还没登录');
    })

  },
  getFilmDetails(id) {
    wx.showLoading({
      title: 'Loading...',
    })
    db.getFilmDetails(id).then(result => {
      wx.hideLoading()
      const data = result.result
      if (data) {
        this.setData({
          filmDetails: data,
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: 'Failed',
      })
    })
  },
  setDisplayReviewButton(id) {
    db.getCommentDetailsViafilmIdAndUser(id).then(result => {
      wx.hideLoading()
      const data = result.result
      if (data && data.length > 0) {
        this.setData({
          hiddenAdd: true,
          hiddenMyReview: false,
          reviewId: data[0]._id
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  //跳转到我的评论详情页
  redirectToMyReview: function () {
    console.log("转到我的评论详情页")
    console.log(this.data.reviewId)
    wx.navigateTo({
      url: '../../my/my-comment/my-comment?id=' + this.data.reviewId + '&hiddenMyReview=' + this.data.hiddenMyReview,
    })
  },
  openCommentList(event) {
    let id = event.currentTarget.dataset.filmid
    wx.navigateTo({
      url: '../film-comment/film-comment?id=' + id
    })
  },
  onTapLogin(event) {
    let userInfo = event.detail.userInfo
    this.setData({
      userInfo: userInfo
    })
    app.globalData.userInfo = userInfo
  }

})