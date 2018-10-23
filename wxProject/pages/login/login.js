// pages/login/login.js
const app = getApp();
Page({
  data: {
    serviceUrl:app.data.serviceUrl,
    deviceType: app.data.deviceType,
    userPhone:'',     //用户手机号
    verCode:'',       //验证码
    password:'',      //密码
    timeStep: 60,
    userCode: app.globalData.userCode,  //用户code
  },
  //密码输入
  pwdInput:function(e){
    var value = e.detail.value;
    this.setData({
      password: value
    })
  },
  //验证码输入
  vercodeInput:function(e){
    var value = e.detail.value;
    this.setData({
      verCode: value
    })
  },
  //手机号奥输入
  phoneInput:function(e){
    var value = e.detail.value;
    this.setData({
      userPhone: value
    })
  },
  //登陆
  userLogin:function(){
    wx.showLoading({
      title: '加载中',
    });
    var mobileReg = /^1[3-9]\d{9}$/;
    var _this = this;
    if(this.data.userPhone.length == 0){
      this.showErrorMsg("请输入手机号");
      return false;
    }
    if (!mobileReg.test(this.data.userPhone)) {
      this.showErrorMsg("请输入正确手机号");
      return false;
    }
    if ( this.data.verCode.length == 0 ) {
      this.showErrorMsg("请输入验证码");
      return false;
    }
    if ( this.data.password.length == 0) {
      this.showErrorMsg("请输入密码");
      return false;
    }
    // if (this.data.password.length < 8) {
    //   this.showErrorMsg("密码不得小于8位");
    //   return false;
    // }
    if (this.data.password.length > 16) {
      this.showErrorMsg("密码不得大于16位");
      return false;
    }
    wx.request({
      url: _this.data.serviceUrl + '/v1/auth/login',
      method: 'POST',
      data: {
        phone: _this.data.userPhone,
        code:_this.data.verCode,
        login_type:2,
        pwd:_this.data.password,
        type: '2',
        version: '33',
        device_code: 'dycd_platform_wechat',
        js_code: app.globalData.userCode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        app.globalData.token = res.data.data.token;
        wx.setStorage({
          key: "token",
          data: res.data.data.token
        })
        if (res.data.code == 1) {
          wx.redirectTo({
            url: '../det/det?carDetType=' + app.globalData.carDetType + '&carDetId=' + app.globalData.carDetId
          })
        } else {
          _this.showErrorMsg(res.data.msg)
        }
      },
      fail: function () {
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })
  },
  //获取验证码
  getVerCode: function(){
    var mobileReg = /^1[3-9]\d{9}$/;
    var _this = this;
    if (_this.data.timeStep != 60) {
      return false;
    }
    if (!mobileReg.test(this.data.userPhone)) {
      this.showErrorMsg("请输入正确手机号");
      return false;
    }
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: _this.data.serviceUrl+'/v1/auth/sendSmsCode', 
      method:'POST',
      data: {
        phone:_this.data.userPhone,
        type:'2',
        version:'33',
        device_code:'dycd_platform_wechat',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 1){
          var verTime = setInterval(function () {
            if (_this.data.timeStep == 1) {
              clearInterval(verTime);
              _this.setData({
                timeStep: 60
              })
            } else {
              var time = _this.data.timeStep;
              time = time - 1;
              _this.setData({
                timeStep: time
              })
            }
          }, 1000)
        }else{
          _this.showErrorMsg(res.data.msg)
        }
      },
      fail:function(){
        wx.hideLoading()
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })
  },
  //跳转忘记密码
  goForget:function(){
    wx.navigateTo({
      url: '../forgetpwd/forgetpwd'
    })
  },
  //跳转注册
  goRegister:function(){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  //错误提示消息
  showErrorMsg:function(msg){
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })  
  },
  onLoad: function (options) {
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
  
  }
})