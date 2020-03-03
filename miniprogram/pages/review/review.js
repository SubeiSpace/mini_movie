// pages/review/review.js
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')
const recordManager = wx.getRecorderManager()

const options = {
        duration: 60000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
        sampleRate: 16000, //采样率
        numberOfChannels: 1, //录音通道数
        encodeBitRate: 96000, //编码码率
        format: 'mp3', //音频格式，有效值 aac/mp3
        frameSize: 50, //指定帧大小，单位 KB
      }

Page({

  /**
   * Page initial data
   */
  data: {
    recordingTime: 0, //录音计时
    setInter: "" ,//录音名称
    soudUrl: "",
    input: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
   
    this.fetchMovieOfId(options)
  },

  fetchMovieOfId(options){
    const param = options.id
    const tag = options.tag
    console.log(tag)

    cloud.db().fetchMovieForId(param).then(({result}) => {
      console.log(result)
      this.setData({
        movie: result,
        isAudio: tag ? true : false
      })
    })
  },
  //开始录音
  recordStart: function(event){
    var that = this
    that.recordingTimer()

    recordManager.start(options)
    recordManager.onStart(() => {
      console.log("start recording...")
    })
    recordManager.onError((res) => {
      console.log(res)
    })
  },
  //录音结束
  recordEnd: function(event){
    var that = this
    recordManager.stop()
    recordManager.onStop((res) => {
      console.log("stop recording...")
      console.log(res)
      let timestamp = util.formatDate(new Date())
      const {tempFilePath} = res
      clearInterval(that.data.setInter)
      wx.cloud.uploadFile({
        cloudPath: 'sounds/' + timestamp + "-" + this.randomNum(1000, 9999) + ".mp3",
        filePath: tempFilePath,
        success : res =>{
          console.log(res)
          this.setData({
            soudUrl: res.fileID,
          })
        }
      })

    })
  },
  //文字输入
  inputReview: function(event){
    const input = event.detail
    this.setData({
      input
    })
  },
  //录音计时器
  recordingTimer : function(){
    var that = this
    that.data.setInter = setInterval(
      function(){
        let time = that.data.recordingTime + 1
        that.setData({
          recordingTime : time
        })
      }, 1000)
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
  completed(){
    const id = this.data.movie._id
    const input = this.data.input
    const soudUrl = this.data.soudUrl
    const recordingTime = this.data.recordingTime

    if(!input && !soudUrl){
      wx.showToast({
        title: "请输入影评内容",
      })
      return
    }

    wx.navigateTo({
      url: `/pages/preview/preview?id=${id}&input=${input}&soudUrl=${soudUrl}&recordingTime=${recordingTime}&isShow={{true}}`,

    })
  }

  
})