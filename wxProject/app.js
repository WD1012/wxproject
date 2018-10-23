//app.js
var app = getApp();
App({
  data:{
    serverUrl:'',
    serviceUrl: "https://gatewayapi.dycd.com",
    // serviceUrl: "http://dev.api-gateway.dycd.com",
    // serviceUrl: "https://api-gateway.test.dycd.com",
      
    carPageUrl: "https://bms.dycd.com",
    deviceType:'dycd_platform_wechat',
    brandList:[],
  },
  getBrand: function(){
    var _this= this;
    
    wx.request({
      url: _this.data.serviceUrl + '/v1/home/brand?token=' + _this.data.mtoken + '&device_code=' + _this.data.deviceType + '&page=1&rows=2&type=1',
      method: 'POST',
      data: {
        version: '33',
        status: 0,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {

          _this.globalData.brandList = res.data.data;
        } else {

        }
      }
    })
  },
  onLaunch: function () {
    var _this = this;
    //获取本地token
    // wx.setStorage({
    //   key: "token",
    //   data: ""
    // })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        _this.globalData.token = res.data;
      },
    })

    // this.getBrand()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  
    // 登录
    wx.login({
      success: res => {
        this.globalData.userCode = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token:'',
    brandList: [],
    userCode:'',
    carDetType:'',
    carDetId:'',
  }
})