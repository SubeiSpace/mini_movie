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
    imagesUrl: '../../../images/voice-icon.gif', //图片路径,
    textType: 1,
    voiceType: 2,
    userInfo: {},
    audioArr: [],

    audKey: '',  //选中的音频key
    reviewList:
    {
      userInfo: {},
      reviewContent: {}
    },
    reviewType: "",
    recordingTimeqwe: ""
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
        console.log("voice address： " + voice)
      }
    })
  },
  stop: function () {
    //结束录音  
    wx.stopRecord();
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    webhelper.getUserInfo().then(userInfo => {
      console.log(userInfo)
      this.setData({
        userInfo: userInfo,
        ['reviewList.userInfo.name']: userInfo.nickName,
        ['reviewList.userInfo.profilePhoto']: userInfo.avatarUrl,
      })
      let previewObj = JSON.parse(options.previewObj)
      console.log("previewObj", +previewObj)
      this.setData({
        filmDetails: previewObj.filmDetails,
        ['reviewList.reviewContent']: previewObj.reviewContent,
        reviewType: previewObj.reviewContent.type,
        recordingTimeqwe: previewObj.reviewContent.recordingTimeqwe
      })

      if (previewObj.reviewContent.type == app.globalData.voiceType) {
        this.setData({
          ['audioArr[0].id']: 1,
          ['audioArr[0].src']: previewObj.reviewContent.content,
          ['audioArr[0].time']: previewObj.reviewContent.recordingTimeqwe + "s",
          ['audioArr[0].bl']: false
        })
      }
    }).catch(err => {
      console.log(err)
      console.log('用户未授权');
    })
  },
  //发布影评
  submitReview: function () {
    wx.showLoading({
      title: 'Loading...',
    })
    db.addComment({
      filmId: this.data.filmDetails._id,
      type: this.data.reviewList.reviewContent.type,
      content: this.data.reviewList.reviewContent.content,
      username: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      time: this.data.recordingTimeqwe
    }).then(result => {
      wx.hideLoading()

      const data = result.result

      if (data) {
        wx.showToast({
          title: 'Succeed',
        })
        wx.redirectTo({
          url: '../film-comment/film-comment?id=' + this.data.filmDetails._id,
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

  },
  //重新编辑
  reEditReview: function () {
    wx.navigateBack()
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