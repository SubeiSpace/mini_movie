// components/audio-button/audio-button.js
Component({
  /**
   * Component properties
   */
  properties: {
    recordingTime:{
      type: Number,
      value: 0
    },
    soundUrl:{
      type: String,
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
      const id = event.target.id
      this.triggerEvent("AudioPlay", id)
    }
  }
})
