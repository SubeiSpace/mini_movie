// components/login/login.js
const util = require('../../utils/util.js')

Component({
  /**
   * Component properties
   */
  properties: {

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
    onGotUserInfo : function(event){
      const userInfo = event.detail.userInfo
      this.triggerEvent("OnLogin", userInfo)
    }
  }
})
