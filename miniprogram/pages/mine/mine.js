// pages/mine/mine.js
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')

Page({

  /**
   * Page initial data
   */
  data: {
    tabs: ['发布的影评','收藏的影评'],
    curIndex: 0,
    user: util.user().getCurrentUser() || null
  },


  onLoad: function (options) {
  },

  onShow(){
    this.setData({
      user: util.user().getCurrentUser() || null,
    })
    wx.startPullDownRefresh()
  },

  onPullDownRefresh: function () {
    this.fetchCollectionOfOpenId()
  },

   /**
     * 微信用户授权,获取用户信息
     * 判定云端是否存在此用户，不存在则添加到云端
     * 本地存储
     */
  onGotUserInfo: function (event) {
    util.user().fetchUser().then(({ user}) => {
      console.log(user, openId)
     
      this.setData({
        user
      })

      this.fetchCollectionOfOpenId()
    }).catch(error => {

    })
  },

  fetchCollectionOfOpenId(){
    const user = this.data.user
    console.log(user)
    if(user){
      cloud.db().fetchCollectionOfOpenId().then(({result}) =>{
        wx.stopPullDownRefresh()
        const {data} = result
        console.log(data)

        let release = []
        let collection = []
        /**
         * 区分发布影评与收藏影评
         * 若userOpenId = OpenId, 则说明是用户发布的影评，反之是收藏的影评
         */
        data.map(it => {
          if(it.userOpenId == it.openId){
            release.push(it)
          }else{
            collection.push(it)
          }
        })

        this.setData({
          total: data,
          release,
          collection
        })

        if (this.data.curIndex == 0) {
          this.setData({ review: this.data.release})
        } else {
          this.setData({ review: this.data.collection })
        }

      }).catch(error => {
        wx.stopPullDownRefresh()
      })
    }else{
      wx.stopPullDownRefresh()
    }

  },

  backToStart(){
    wx.navigateBack({ })
  },

  audioPlay: function(event){
    const soudUrl = event.detail
    console.log(soudUrl)
    if (!soudUrl) return

    var tempSound = util.midstr(soudUrl)
    console.log(tempSound)
    wx.playBackgroundAudio({
      dataUrl: tempSound,
    })
  },

  //选项卡切换事件
  clickTab:function(event){
    console.log(event)
    const current = event.currentTarget.dataset.current
    if(current == 0){
      this.setData({review: this.data.release, curIndex : current})
    }else{
      this.setData({ review: this.data.collection, curIndex: current})
    }
  },

  swiperTab: function (e) {
    const current = e.detail.current
    if (current == 0) {
      this.setData({ review: this.data.release, curIndex: current })
    } else {
      this.setData({ review: this.data.collection, curIndex: current })
    }
  },

  onItemClick: function(event){
    console.log(event)
    const id = event.currentTarget.id
    const openId = event.detail
    wx.navigateTo({
      url: `/pages/recommend/recommend?id=${id}&openId=${openId}`,
    })
  }
  
})