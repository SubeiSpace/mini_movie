// components/movie_review/movie_review.js
const util = require('../../utils/util.js')

Component({
  /**
   * Component properties
   */
  properties: {
    movie_image: {
      type: String,
      value: null
    },
    movie_name:{
      type: String,
      value: null
    },
    movie_id: {
      type: String,
      value: null
    },
    user:{
      type: Object,
      value: null
    },
    button:{
      type: Array,
      value:[]
    },
    review:{
      type: String,
      value: null
    },
    soudUrl:{
      type: String,
      value: null
    }, 
    recordingTime:{
      type: String,
      value: null
    },
    reviewed:{
      type: Boolean,
      value: false
    },
    isTheUser:{
      type: Boolean,
      value:false
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
    firstHandle: function (event) {
      const id = event.detail
      this.triggerEvent("FirstHandle", id)
    },
    secondHandle: function (event) {
      const id = event.detail
      this.triggerEvent("SecondHandle", id)
    },
    thirdHandle: function (event) {
      const id = event.detail
      this.triggerEvent("ThirdHandle", id)
    },
    audioPlay: function(event){
      console.log(event)
      this.triggerEvent("AudioPlay", '')
    },
    errorLoaded(event) {
      this.setData({
        movie_image: '/images/default.png'
      })
    },
  }
})
