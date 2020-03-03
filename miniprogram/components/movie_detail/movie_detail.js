// components/movie_detail/movie_detail.js
Component({
  /**
   * Component properties
   */
  properties: {
    movie:{
      type: Object,
      value: {}
    },
    height:{
      type: Number,
      value: 550
    },
    button:{
      type: Array,
      value:[]
    },
    isReview:{
      type: Boolean,
      value: false
    },
    isAudio: {
      type: Boolean,
      value: false
    },
    reviewed:{
      type: Boolean,
      value: false
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
    firstHandle: function(event){
      const id = event.detail
      this.triggerEvent("FirstHandle", id)
    },
    secondHandle: function(event){
      const id = event.detail
      this.triggerEvent("SecondHandle", id)
    },
    thirdHandle: function (event) {
      const id = event.detail
      this.triggerEvent("ThirdHandle", id)
    },
    recordStart:function(event){
      const id = event.target.id
      console.log(id)
      this.triggerEvent("RecordStart", id)
    },
    recordEnd: function(event){
      const id = event.target.id
      this.triggerEvent("RecordEnd", id)
    },
    inputReview:function(event){
      const content = event.detail.value
      this.triggerEvent("InputReview", content)
    }
  }
})
