const webhelper = require('./webhelper')

const db = wx.cloud.database({
  env: 'lucky-08bed5'
})

module.exports = {
  getRandomFilm() {
    // var index = Math.floor((Math.random() * db.collection('film').count));
    return db.collection('films').limit(1).get()
  },
  getRandomReview(id) {
    return db.collection('review').where({
      filmid: id
    }).limit(1).get()
  },
  getFilmList() {
    return db.collection('films').orderBy('slotNo','asc').get()
  },
  getCommentDetails(id) {
    return db.collection('review').doc(id).get()
  },
  //获取电影详情
  getFilmDetails(id) {
    return wx.cloud.callFunction({
      name:"getFilmDetails",
      data:{
        id
      }
    })
  },
  //根据ID获取电影列表
  getFilmListById(idList) {
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getFilmListById',
          data: {
            filmIdList: idList
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  addComment(data){
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'addComment',
          data,
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getCommentList(id) {
    console.log("db id:"+id)
        return wx.cloud.callFunction({
          name: 'getCommentList',
          data: {
            id: id
          }
        })
  },
  addFavComment(data) {
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'addFavComment',
          data
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getFavCommentList(id) {
    return webhelper.isAuthenticated()
      .then(() => {
        console.log("db id:" + id)
        return wx.cloud.callFunction({
          name: 'getFavCommentList',
          data: {
            id: id
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getFavCommentListViaUser() {
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({ 
          name: 'getFavCommentListViaUser'
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getSubmittedCommentList() {
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getSubmittedCommentList',
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getCommentListViaIdList(idList) {
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getCommentListViaIdList',
          data:{
            reviewIdList: idList
          }
        })
      }).catch((err) => {
        console.log(err)
        return {}
      })
  },
  getCommentDetailsViafilmIdAndUser(id) {
    return webhelper.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getCommentDetailsViafilmIdAndUser',
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
        return wx.cloud.callFunction({
          name: 'getUserId',
        })
  }

  
}
