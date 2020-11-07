const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    inform: '本小程序用于团员值守垃圾桶活动随机排序，如需了解活动安排及排序原理请',
    array1: [],
    array2: [],
    button: 'Loading',
    nickName:'',
    imgUrl:'',
    auth: false,
    showButton: false,
    num1: 0,
    num2: 0,
    remain: 0,
  },
  onLoad: function() {
    this.checkAuth()
    this.initView()
  },
  onShow: function() {
    const that = this
    const watcher1 = db.collection('Sorter').doc('test').watch({
      onChange: function(snapshot1) {
        console.log('snapshot1', snapshot1.docs[0])
        var res = snapshot1.docs[0]
        that.setData({
          array1: res.array1.slice(0,18),
          array2: res.array2.slice(0,18),
          num1: res.num1,
          num2: res.num2
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
    // this.initialize()
  },
  checkAuth: function() {
    var that =  this
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                auth: true,
                nickName: res.userInfo.nickName,
                imgUrl: res.userInfo.avatarUrl
              })
            }
          })
          setTimeout(that.initialize, 1000)
        }
        else{
          that.setData({
            showButton:true
          })
        }
      }
    })
  },
  userInfo: function(e){
    console.log(e.detail.userInfo);
    var userInfo = e.detail.userInfo
    this.setData({
      auth: true,
      nickName: userInfo.nickName,
      imgUrl: userInfo.avatarUrl
    })
    setTimeout(this.initialize, 1000)
  },
  detail: function() {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  initialize:function(){
    const that = this
    const watcher2 = db.collection('Sorter').where({_id: this.data.nickName}).watch({
      onChange: function(snapshot2) {
        console.log('snapshot2', snapshot2)
        var res = snapshot2.docs[0]
        // console.log(snapshot2.docs.length)
        if(snapshot2.docs.length==0){
          db.collection('Sorter').add({
            data: {
              _id: that.data.nickName,
              remain: 2
            }
          })
          that.setData({
            remain: 2,
            button: '第一次抽取'
          })
        }else{
          var remain = res.remain
          if(remain==2) {var button = "第一次抽取"}
          else if(remain==1) {var button = "第二次抽取"}
          else {var button = "已完成"}
          that.setData({
            remain: remain,
            button: button
          })
        }
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  initView: function(){
    db.collection('Sorter').doc('test')
    .get().then(res => {
      console.log(res.data)
      this.setData({
        array1: res.data.array1.slice(0,18),
        array2: res.data.array2.slice(0,18),
        num1: res.data.num1,
        num2: res.data.num2
      })
    })
  },
  add: function() {
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      mask: true, 
      duration: 2000
    })
    if(this.data.remain==2){
      var num = this.data.num1+1
      var order = 0
      for (let index = 10; index; index--) {
        order = Math.floor(Math.random()*num)
      }
      console.log('order1',order)
      wx.cloud.callFunction({
        name: 'drawLots',
        data: {
          array: 'array1',
          nickName: this.data.nickName,
          imgUrl: this.data.imgUrl,
          order: order
        }
      })
      .then(res => {
        console.log(res)
        db.collection('Sorter').doc(this.data.nickName).update({
          data: {
            remain: _.inc(-1)
          }
        })
      })
      .catch(console.error)
    }
    if(this.data.remain==1){
      var num = this.data.num2+1
      var order = 0
      for (let index = 10; index; index--) {
        order = Math.floor(Math.random()*num)
      }
      console.log('order2',order)
      wx.cloud.callFunction({
        name: 'drawLots',
        data: {
          array: 'array2',
          nickName: this.data.nickName,
          imgUrl: this.data.imgUrl,
          order: order
        }
      })
      .then(res => {
        console.log(res)
        db.collection('Sorter').doc(this.data.nickName).update({
          data: {
            remain: _.inc(-1)
          }
        })
      })
      .catch(console.error)
    }
  }
})