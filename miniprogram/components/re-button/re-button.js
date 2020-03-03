// components/button/button.js
Component({
  /**
   * Component properties
   */
  properties: {
    image:{
      type: String,
      value: ''
    },
    title:{
      type: String,
      value: ''
    },
    target:{
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
    navToTarget:function(event){
      const id = event.currentTarget.id
      this.triggerEvent("ToTarget", id)
    }
  }
})
