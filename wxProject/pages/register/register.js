// pages/register/register.js
const app = getApp();

Page({
  data: {
    serviceUrl: app.data.serviceUrl,
    userPhone:'',
    timeStep:60,
    verCode:'',
    password:'',
    repassword:'',
    username:'',
    companyName:'',
    userCode: app.globalData.userCode,  //用户code
  },
  //错误提示消息
  showErrorMsg: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  //注册提交
  registerSub:function(){
    var _this = this;
    var mobileReg = /^1[3-9]\d{9}$/;
    var nameReg = /^[\u4e00-\u9fa5]+$/;

    if (this.data.userPhone.length == 0){
      this.showErrorMsg('请输入手机号')
      return false;
    }

    if (!mobileReg.test(this.data.userPhone)) {
      this.showErrorMsg("请输入正确手机号");
      return false;
    }
    if ( this.data.verCode.length == 0) {
      this.showErrorMsg('请输入验证码')
      return false;
    }
    if ( this.data.password.length == 0) {
      this.showErrorMsg('请输入密码')
      return false;
    }
    if ( this.data.repassword.length == 0 ) {
      this.showErrorMsg('请再次输入密码')
      return false;
    }
    if (this.data.password != this.data.repassword) {
      this.showErrorMsg('两次输入密码不一致')
      return false;
    }
    if (this.data.password.length < 8) {
      this.showErrorMsg("密码不得小于8位");
      return false;
    }
    if (this.data.password.length > 16) {
      this.showErrorMsg("密码不得大于16位");
      return false;
    }
    if (this.data.username.length == 0 ) {
      this.showErrorMsg('请输入姓名')
      return false;
    }
    if (!nameReg.test(this.data.username)) {
      this.showErrorMsg('请输入正确商户姓名')
      return false;
    }
    if (this.data.username < 2 || this.data.username > 16) {
      this.showErrorMsg("请输入正确商户姓名");
      return false;
    }
    if ( this.data.companyName.length == 0) {
      this.showErrorMsg('请输入商户名称')
      return false;
    }
    if (!nameReg.test(this.data.companyName)) {
      this.showErrorMsg('请输入正确商户名称')
      return false;
    }
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: _this.data.serviceUrl + '/v2/auth/register',
      method: 'POST',
      data: {
        phone: _this.data.userPhone,
        code:_this.data.verCode,
        confirm_pwd:_this.data.repassword,
        merchant_name:_this.data.companyName,
        pwd:_this.data.password,
        user_name:_this.data.username,
        type: '1',
        version: '33',
        device_code: 'dycd_platform_wechat',
        js_code:app.globalData.userCode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          _this.showErrorMsg(res.data.msg)
          wx.navigateBack();
        } else {
          _this.showErrorMsg(res.data.msg)
        }
      },
      fail: function () {
        wx.hideLoading()
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })

  },
  //商户名输入
  conpanyInput: function (e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  //姓名输入
  nameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //重复密码输入
  repwdInput: function (e) {
    this.setData({
      repassword: e.detail.value
    })
  },
  //密码输入
  pwdInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  //验证码输入
  vercodeInput:function(e){
    this.setData({
      verCode: e.detail.value
    })
  },
  //获取验证码
  getVercode:function(){
    var mobileReg = /^1[3-9]\d{9}$/;
    var _this = this;
    if(_this.data.timeStep != 60){
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
      url: _this.data.serviceUrl + '/v1/auth/sendSmsCode',
      method: 'POST',
      data: {
        phone: _this.data.userPhone,
        type: '1',
        version: '33',
        device_code: 'dycd_platform_wechat',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          var verTime = setInterval(function(){
            if(_this.data.timeStep == 1){
              clearInterval(verTime);
              _this.setData({
                timeStep: 60
              })
            }else{
              var time = _this.data.timeStep;
              time = time - 1;
              _this.setData({
                timeStep: time
              })
            }
          },1000)
        } else {
          _this.showErrorMsg(res.data.msg)
        }
      },
      fail: function () {
        wx.hideLoading()
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })
  },
  //手机号输入
  phoneInput:function(e){
    this.setData({
      userPhone:e.detail.value
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