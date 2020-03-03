// components/movie_item/movie_item.js
Component({
  /**
   * Component properties
   */
  properties: {
    //是否是影评内容, true:显示电影类型， false:显示影评
    isReview:{
      type: Boolean,
      value: true
    },
    movie:{
      type: Object,
      value:　{}
    },
    recordingTime:{
      type: String,
      value:''
    },
    id:{
      type:String,
      value:''
    },
    openId:{
      type:String,
      value:''
    }

  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    audioPlay: function(event){
      console.log(event)
      const id = event.detail
      this.triggerEvent("AudioPlay", id)
    },

    errorLoaded(event) {
      this.setData({
        recommendImage: '/images/default.png'
      })
    },

    onItemClick: function (event) {
      console.log(event)
      const id = event.currentTarget.dataset.openid
      this.triggerEvent("OnItemClick", id)
    }
  },

  
})
