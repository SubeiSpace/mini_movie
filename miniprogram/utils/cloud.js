const cloud = wx.cloud.database({
  env: "mini-movie-gi442"
})

const db = () => ({
  queryUser: () => new Promise((reslove, reject) => {
    wx.cloud.callFunction({
      name: "queryUserOfOpenid"
    }).then(res => {
      const {result} = res
      reslove({result})
    })
  }),

  login: (user) => new Promise((reslove, reject) => {
    wx.cloud.callFunction({
      name: "signIn",
      data: {
        username: user.nickName,
        avatarUrl : user.avatarUrl
      }
    }).then(res => {
      const { result } = res
      reslove({ result })
    })
  }),

  //获取电影列表信息
  hotMovies: () => new Promise((resolve, reject) =>{
    cloud.collection("movies").get().then(result => {
      const {data} = result
      resolve({data})
    })
  }),

  //根据电影Id获取对应的电影信息
  fetchMovieForId: (id) => new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "queryMovieOfID",
      data:{
        id: id
      }
    }).then(res => {
      const {result} = res
      resolve({result})
    })
  }),

  //根据电影Id获取对应的影评
  fetchReview: (id) => new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'review',
      data: {
        id: id
      }
    }).then(res => {
      console.log(res)
      const {result} = res
      resolve({result})
    })
  }),

  //根据电影ID获取影评信息
  fetchReviewOfId: (openId, id) => new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'fetchReviewOfId',
      data: { 
        openId,
        id
      }
    }).then(res => {
      console.log(res)
      const { result } = res
      resolve({ result })
    })
  }),

  /**
   * 发布影评：（电影Id, 电影图片，电影名，用户信息， 影评，音频）
   */
  releaseReview: (id, image, name, user, review, soudUrl, recordingTime) => new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'add-review',
      data:{
          id,
          image,
          name,
          user,
          review, 
          soudUrl,
          recordingTime
      }
    }).then(result => {
      console.log(result)
      resolve({result})
    })
  }),

  //获取所有的影评
  fetchAllReview: () => new Promise((resolve, reject) => {
    cloud.collection('review').get().then(result => {
      const { data } = result
      resolve({ data })
    })
  }),

  //收藏影评 （电影id, 电影名字，电影图片，影评人信息，影评内容）
  //addOrCollection: 用于判定用户是自己发布Or收藏
  collection: (reviewRes, userOpenId) => new Promise((reslove, reject) => {
    wx.cloud.callFunction({
      name: 'collection',
      data:{
        res : reviewRes,
        userOpenId
      }
    }).then(res => {
      console.log(res)
      const {result} = res
      reslove({result})
    })
  }),

  //获取收藏影评
  fetchCollectionOfOpenId: () => new Promise((reslove, reject) =>{
    wx.cloud.callFunction({
      name: 'fetchCollectionOfOpenid'
    }).then(res => {
      console.log(res)
      const {result} = res 
      console.log(result)
      reslove({result})
    })
  }),

  fetchReviewOfOpenId: (id) => new Promise((reslove, reject) => {
    wx.cloud.callFunction({
      name: 'fetchReviewOfOpenid',
      data:{
        id
      }
    }).then(res => {
      console.log(res)
      const { result } = res
      console.log(result)
      reslove({ result })
    })
  })
})

module.exports = {
  db
}