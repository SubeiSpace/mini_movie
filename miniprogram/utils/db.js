const util = require('./util')

const db = wx.cloud.database({
  env: 'lucky-08bed5'
})

module.exports = {
  getFilmList() {
    return db.collection('films').orderBy('slotNo','asc').get()
  },
  getRandomFilm() {
   // var index = Math.floor((Math.random() * db.collection('film').count));
    return db.collection('films').limit(1).get()
  },
  getReviewDetails(id) {
    return db.collection('review').doc(id).get()
  },
  getRandomReview(id){
    return db.collection('review').where({
      filmid:id
    }).limit(1).get()
  },
  addFilm(data) {
    return wx.cloud.callFunction({
      name: 'addFilm',
      data
    })
  },
  getFilmDetails(id) {
    return wx.cloud.callFunction({
      name:"getFilmDetails",
      data:{
        id
      }
    })
  },
  addReview(data){
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'addReview',
          data,
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getReviewList(id) {
    return util.isAuthenticated()
      .then(() => {console.log("db id:"+id)
        return wx.cloud.callFunction({
          name: 'getReviewList',
          data: {
            id: id
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  addFavReview(data) {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'addFavReview',
          data
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getFavReviewList(id) {
    return util.isAuthenticated()
      .then(() => {
        console.log("db id:" + id)
        return wx.cloud.callFunction({
          name: 'getFavReviewList',
          data: {
            id: id
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getFavReviewListViaUser() {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({ 
          name: 'getFavReviewListViaUser'
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getSubmittedReviewList() {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getSubmittedReviewList',
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getReviewListViaIdList(idList) {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getReviewListViaIdList',
          data:{
            reviewIdList: idList
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getFilmListViaIdList(idList) {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getFilmListViaIdList',
          data: {
            filmIdList: idList
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getReviewDetailsViafilmIdAndUser(id) {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getReviewDetailsViafilmIdAndUser',
          data: {
            id: id
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getUserId(){
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getUserId',
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  }

  
}
