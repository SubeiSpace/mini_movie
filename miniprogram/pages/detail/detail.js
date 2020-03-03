// pages/detail/detail.js
const cloud = require('../../utils/cloud.js')
const util = require('../../utils/util.js')

const button = [{title: "影评列表", image: "/images/search.png"},
              {title: "添加影评", image: "/images/add_review.png"},
              {title: "我的影评", image: "/images/add_review.png"}  ]

Page({

  data: {
    id: null,
    detail: null,
    button: button,
    user: util.user().getCurrentUser() || null,
    reviewed: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    const id = options.id
    cloud.db().fetchMovieForId(id).then(({result}) => {
      this.setData({
        detail: result,
        id
      })
    })

    this.fetchReviewOfOpenid(id)
  },

  onShow(){
    this.setData({
      user: util.user().getCurrentUser() || null
    })
  },
  /**
   * 根据用户OpenId和电影Id获取影评信息
   * 若获取数据，则显示“我的影评”，若没有，则显示“添加影评”
   */ 
  fetchReviewOfOpenid: function(id){
    console.log(id)
    cloud.db().fetchReviewOfOpenId(id).then(({result}) => {
      console.log(result)
      this.setData({
        review: result.data.length == 0 ? null : result.data[0],
        reviewed: result.data.length == 0 ? false : true
      })
    })
  },
  //影评列表
  firstHandle:function(event){
    const user = util.user().getCurrentUser() || null

    if(!user){
      wx.showToast({
        title: '请先登录',
      })
      return
    }
    const id = this.data.id
    wx.navigateTo({
      url: '/pages/check-review/check-review?id=' + id,
    })

  },
  //添加影评
  secondHandle: function(event){
    if (!this.data.user) {
      wx.showToast({
        title: '请先登录',
      })
      return
    }

    console.log(event)
    wx.showActionSheet({
      itemList: ["文字", "音频"],
      success: res =>{
        console.log(res)
        let tag ;
        if(res.tapIndex == 0){
          tag = ''
        }else{
          tag = 'audio'
        }

        wx.navigateTo({
          url: `/pages/review/review?id=${this.data.id}&tag=${tag}`,
        })
      }
    })
  },
  //我的影评
  thirdHandle: function(event){
    if (!this.data.user) {
      wx.showToast({
        title: '请先登录',
      })
      return
    }

    console.log(this.data.review)
    if(!this.data.review) return

    wx.navigateTo({
      url: '/pages/recommend/recommend?id=' + this.data.review.id,
    })


  }
  
})