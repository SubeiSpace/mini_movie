// pages/preview/preview.js
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')

const button = [{ title: "重新编辑", image: "/images/search.png" },
                { title: "发布影评", image: "/images/add_review.png" }]

Page({

  /**
   * Page initial data
   */
  data: { 
    id: null,
    button: button,
    user: util.user().getCurrentUser() || null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(options)
    const { id, input, soudUrl, recordingTime , isShow}  = options
    this.setData({
      id,
      input,
      soudUrl,
      recordingTime,
      isShow
    })

    this.fetchMovieOfId()
  },
  
  //重新编辑
  reEditorHandle:function(event){
    wx.navigateBack({})
  },

  //发布影评
  releaseHandle:function(event){
    const movie = this.data.movie
    cloud.db().releaseReview(movie._id, movie.image, movie.name, this.data.user, this.data.input, this.data.soudUrl, this.data.recordingTime).then(({result}) => {

      const reviewRes = {
        id: movie._id,
        image: movie.image,
        name: movie.name,
        review: this.data.input,
        soudUrl: this.data.soudUrl,
        user: this.data.user,
        recordingTime: this.data.recordingTime
      }

      cloud.db().collection(reviewRes, '').then(({ result }) => {

        wx.navigateTo({
          url: '/pages/check-review/check-review?id=' + movie._id,
        })
      })
     
    })
  },
  //根据电影Id获取电影信息
  fetchMovieOfId: function(){
    const movieId = this.data.id
    cloud.db().fetchMovieForId(movieId).then(({result}) =>{
      console.log(result)
        this.setData({
          movie: result,
          image: result.image,
          name: result.name,
          id: result._id
        })
    })
  },

  //播放录音
  audioPlay: function () {
    const soudUrl = this.data.soudUrl
    console.log(soudUrl)
    if(!soudUrl) return

    var tempSound = util.midstr(soudUrl)
    console.log(tempSound)
    wx.playBackgroundAudio({
      dataUrl: tempSound,
    })

  }
  
})