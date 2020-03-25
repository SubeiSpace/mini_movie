const webhelper = require('../../../utils/webhelper')
const db = require('../../../utils/cloud-functions')

const app = getApp()
const myaudio = wx.createInnerAudioContext()

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
    selectedManner: "",
    imagesUrl: '../../../images/voice-icon.gif', //图片路径,
    textType: 1,
    voiceType: 2,
    audioArr: [],
    audKey: '',  //选中的音频key
    reviewDetails: {},
    userInfo: {},
    filmid: "",
    hiddenAll: false,
    hiddenFavOnly: true
  },

  actionSheetTap: function () {
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
      url: '../../film/film-comment-edit/film-comment-edit?reviewtype=' + app.globalData.textType + '&filmid=' + this.data.filmDetails._id,
    })
  },
  bindvoiceManner: function () {
    this.setData({
      selectedManner: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.navigateTo({
      url: '../../film/film-comment-edit/film-comment-edit?reviewtype=' + app.globalData.voiceType + '&filmid=' + this.data.filmDetails._id,
    })
  },

  //音频播放  
  audioPlay(e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      key = e.currentTarget.dataset.key,
      audioArr = that.data.audioArr;

    //设置状态
    audioArr.forEach((v, i, array) => {
      v.bl = false;
      if (i == key) {
        v.bl = true;
      }
    })
    that.setData({
      audioArr: audioArr,
      audKey: key,
    })

    myaudio.autoplay = true;
    var audKey = that.data.audKey,
      vidSrc = audioArr[audKey].src;
    myaudio.src = vidSrc;

    myaudio.play();

    //开始监听
    myaudio.onPlay(() => {
      console.log('开始播放');
    })

    //结束监听
    myaudio.onEnded(() => {
      console.log('自动播放完毕');
      audioArr[key].bl = false;
      that.setData({
        audioArr: audioArr,
      })
    })

    //错误回调
    myaudio.onError((err) => {
      console.log(err);
      audioArr[key].bl = false;
      that.setData({
        audioArr: audioArr,
      })
      return
    })

  },

  // 音频停止
  audioStop(e) {
    var that = this,
      key = e.currentTarget.dataset.key,
      audioArr = that.data.audioArr;
    //设置状态
    audioArr.forEach((v, i, array) => {
      v.bl = false;
    })
    that.setData({
      audioArr: audioArr
    })

    myaudio.stop();

    //停止监听
    myaudio.onStop(() => {
      console.log('停止播放');
    })

  },
  play: function () {
    //播放声音文件  
    wx.playVoice({
      filePath: voice
    })
  },
  start: function () {
    //开始录音  
    wx.startRecord({
      success: function (e) {
        voice = e.tempFilePath
      }
    })
  },
  stop: function () {
    //结束录音  
    wx.stopRecord();
  },

  saveFavReview: function () {
    wx.showLoading({
      title: 'Loading...',
    })
    webhelper.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
      db.addFavComment({
        reviewid: this.data.reviewDetails._id
      }).then(result => {
        wx.hideLoading()
        const data = result.result
        if (data) {
          wx.showToast({
            title: 'Succeed',
          })
        }
      })
    }).catch(err => {
      console.log('用户没登录');
      wx.redirectTo({
        url: '../../my/my-info/my-info',
      })
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let id = options.id
    let hiddenFavOnly = options.hiddenMyReview
    if (hiddenFavOnly === "false") {
      this.setData({
        hiddenAll: true,
        hiddenFavOnly: false
      })
    }
    this.setReviewDetails(id)
  },

  setReviewDetails(id) {
    wx.showLoading({
      title: 'Loading...',
    })


    db.getCommentDetails(id).then(result => {
      wx.hideLoading()
      const data = result.data
      let filmid = data.filmid
      let reviewtype = data.type

      if (data) {
        wx.showToast({
          title: 'Succeed',
        })
        this.setData({
          reviewDetails: data,
          filmid: filmid
        })
        if (reviewtype == app.globalData.voiceType) {
          this.setData({
            ['audioArr[0].id']: data._id,
            ['audioArr[0].src']: data.content,
            ['audioArr[0].time']: "",
            ['audioArr[0].bl']: false
          })
        }
        db.getFilmDetails(filmid).then(result => {
          wx.hideLoading()
          const data = result.result
          if (data) {
            wx.showToast({
              title: 'Succeed',
            })
            this.setData({
              filmDetails: data
            })
          }
        })
      }
    })

    webhelper.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })

    }).catch(err => {
      console.log('未授权');
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
  onShow() {
    webhelper.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('还没登录');
    })

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