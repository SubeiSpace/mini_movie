const util = require('../../../utils/webhelper')
const db = require('../../../utils/cloud-functions')

Page({

  /**
   * Page initial data
   */
  data: {
    filmList: []
  },
  onLoad: function (options) {
    this.getFilmList();
  },
  onPullDownRefresh: function () {

  },
  //获取电影列表
  getFilmList() {
    wx.showLoading({
      title: 'Loading...',
    })
    db.getFilmList().then(result => {
      wx.hideLoading()
      const data = result.data
      if (data) {
        this.setData({
          filmList: data
        })
      }
      wx.stopPullDownRefresh()
    }).catch(err => {
      console.error(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: 'Failed',
      })
      wx.stopPullDownRefresh()
    })
  },
  //跳转到详情页
  openDetails(event) {
    let id = event.currentTarget.dataset.filmid
    wx.navigateTo({
      url: '../film-details/film-details?id=' + id,
    })
  }
})