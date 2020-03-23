const util = require('../../utils/util')
const db = require('../../utils/db')
const app = getApp()
const recorderManager = wx.getRecorderManager()
const backgroundAudio = wx.getBackgroundAudioManager()

Page({

  /**
   * Page initial data
   */
  data: {
    filmDetails: {},
    reviewtype:"",
    filmid:"",
    textType:app.globalData.textType,
    voiceType: app.globalData.voiceType,
    content:"",
    focus:true,
    previewObj:{},
    reviewContent:{},

    //record voice data
    openRecordingdis: "block", //显示录机图标
    shutRecordingdis: "none", //隐藏停止图标
    recordingTimeqwe: 0, //录音计时
    setInter: "", //录音名称
    soundUrl: "",
    imagesUrl:'/images/voice-icon.gif',
    showRecording:"none"




  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    let filmid = options.filmid
    let reviewtype = options.reviewtype
    this.setData({
      filmid: filmid,
      reviewtype: reviewtype,
    })

    wx.showLoading({
      title: 'Loading...',
    })
    db.getFilmDetails(filmid).then(result=>{
      wx.hideLoading()
      const data = result.result
      if(data){
        this.setData({
          filmDetails: data,
          ['previewObj.filmDetails']: data
        })
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: 'Failed',
      })
    })
    
  },
  bindFormSubmit:function(e){
    let content = this.data.previewObj.reviewContent.content
    if (content === '' || Object.prototype.toString.call(content) === '[object Undefined]') {
      wx: wx.showToast({
        icon:"none",
        title: '请输入您的评论'
      })
      return false
    }

    this.setData({
      focus: 'false',
      ['previewObj.reviewContent.type']: this.data.reviewtype,
      ['previewObj.reviewContent.recordingTimeqwe']: this.data.recordingTimeqwe

    })
    wx.navigateTo({
      url: '../film-comment-preview/film-comment-preview?previewObj=' + JSON.stringify(this.data.previewObj) ,
    })
  },
  bindTextAreaInput: function (e) {
    this.setData({
      content: e.detail.value,
      ['previewObj.reviewContent.content']: e.detail.value
    })
  },

  

    //录音计时器
    recordingTimer: function () {
      var that = this;
      //将计时器赋值给setInter
      that.data.setInter = setInterval(
        function () {
          var time = that.data.recordingTimeqwe + 1;
          that.setData({
            recordingTimeqwe: time
          })
        }, 1000);
    },

    //开始录音
    openRecording: function () {
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            shutRecordingdis: "block",
            openRecordingdis: "none"
          })
        }
      })
      const options = {
        duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
        sampleRate: 16000, //采样率
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 96000, //编码码率
        format: 'mp3', //音频格式，有效值 aac/mp3
        frameSize: 50, //指定帧大小，单位 KB
      }
      //开始录音计时   
      that.recordingTimer();
      //开始录音
      recorderManager.start(options);
      recorderManager.onStart(() => {
        console.log('。。。开始录音。。。')
      });
      //错误回调
      recorderManager.onError((res) => {
        console.log(res);
      })
    },

    //结束录音
    shutRecording: function () {
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            shutRecordingdis: "none",
            openRecordingdis: "block",
            showRecording: "block"
          })
        }
      })
      recorderManager.stop();
      recorderManager.onStop((res) => {
        const that = this
        let timestamp = util.getStampFromDate();
        console.log('。。停止录音。。', res.tempFilePath)
        const {
          tempFilePath
        } = res;
        //结束录音计时  
        clearInterval(that.data.setInter);
        wx.cloud.uploadFile({
          cloudPath: "sounds/" + timestamp + '-' + this.randomNum(10000, 99999) + '.mp3',
          filePath: tempFilePath,
          // 成功回调
          success: res => {
            console.log('上传成功', res)
            let fileId = res.fileID
            let voiceFilePath = app.globalData.voiceContextPath + this.midstr(fileId)
            that.setData({
              soundUrl: fileId,
              content: voiceFilePath,
              ['previewObj.reviewContent.content']: voiceFilePath
              // time: util.formatTime1(new Date())
            })
          },
        })
      })
    },

    //录音播放
    recordingAndPlaying: function (eve) {
      var tempsound = eve.currentTarget.dataset.soundid
      tempsound = app.globalData.voiceContextPath + this.midstr(tempsound)
      wx.playBackgroundAudio({
        //播放地址
        dataUrl: tempsound
      })

    },

    //生成随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    },

    //获取最后一个/号后的内容
    midstr(str) {
      var strnum = str.lastIndexOf('/')
      var ministr = str.substr(strnum)
      return ministr
    },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  }
})