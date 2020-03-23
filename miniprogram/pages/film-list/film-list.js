// miniprogram/pages/film-list/file-list.js
const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * Page initial data
   */
  data: {
    filmList: []
  },
  onLoad: function (options) {
    //this.initFilmList();
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
  redirectToDetails(event){
    let id = event.currentTarget.dataset.filmid
    wx.navigateTo({
      url: '../film-details/film-details?id=' + id,
    })
  },
  //初始化电影列表
  initFilmList() {
    wx.showLoading({
      title: 'Loading...',
    })
    this.data.filmList.forEach(function (item, index) {
      console.info(item);
      db.addFilm({
        imageurl: item.imageurl,
        filmname: item.filmname,
        filmtype: item.filmtype,
        description: item.description
      }).then(result => {
        wx.hideLoading()

        const data = result.result

        if (data) {
          wx.showToast({
            title: 'Succeed',
          })

        }
      }).catch(err => {
        console.error(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: 'Failed',
        })
      })
    })
  },
  onPullDownRefresh: function () {
    this.getFilmList()
  }
  



})