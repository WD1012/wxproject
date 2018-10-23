// pages/det/det.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageUrl:'',
    shareUrl:'',
    carDetType:'',
    shareType:'',
    sharePageUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var midUrl = '';
    var platform = '&platform=wechat';
    var newplatform = 'platform=wechat';
    
    if (options.shareType){
      this.setData({
        shareType: options.shareType
      })
    }
    this.setData({
      carDetType: options.carDetType
    })
    if (this.data.shareType == 'share'){
      var deUrl = unescape(options.sharePageUrl)
      this.setData({
        pageUrl: deUrl,
      })
    }else{
      if (options.carDetType == 'old'){
        midUrl = '/platform/car_detail.html?id='
        this.setData({
          pageUrl: app.data.carPageUrl + midUrl + options.carDetId + platform,
          shareUrl: '/pages/det/det?carDetType=' + options.carDetType + '&carDetId=' + options.carDetId
        })
      } else if (options.carDetType == 'new'){
        midUrl = '/platform/car_detail_share.html?id='
        this.setData({
          pageUrl: app.data.carPageUrl + midUrl + options.carDetId + platform,
          shareUrl: '/pages/det/det?carDetType=' + options.carDetType + '&carDetId=' + options.carDetId
        })
      } else if (options.carDetType == 'banner') {
        midUrl = '/platform/car_detail_share.html?id='
        if (options.bannerUrl.indexOf('?') != -1){
          options.bannerUrl = options.bannerUrl + platform;
          console.log(1)
          console.log(options.bannerUrl)
        }else{
          options.bannerUrl = options.bannerUrl + '?' + newplatform;
          console.log(2)
			console.log(options.bannerUrl)
        }
        this.setData({
          pageUrl: options.bannerUrl,
          shareUrl: '/pages/det/det?carDetType=' + options.carDetType + '&bannerUrl=' + options.bannerUrl
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opt) {
    var urlStr = opt.webViewUrl;
    if(urlStr.indexOf("?") != -1){
      urlStr = urlStr + "&show=true"
    }else{
      urlStr = urlStr + "?show=true"
    }
    var enUrl = escape(urlStr)
    this.setData({
      sharePageUrl: '/pages/det/det?shareType=share&carDetType=' + this.data.carDetType + '&sharePageUrl=' + enUrl
    })

    var _this = this;
    return {
      imageUrl:'../../image/shareImg.png',
      title: '第1车贷',
      path: _this.data.sharePageUrl
    }
  }
})