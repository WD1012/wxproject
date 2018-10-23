// pages/login/index.js
const app = getApp();
Page({
  data: {
    serviceUrl: app.data.serviceUrl,
    childPage:'1',    //1:首页   2：新车  3：二手车
    newCarList:{},    //新车列表
    oldCarList:{},    //二手车列表
    bannerList:{},    //banner列表
    mtoken: app.globalData.token,
    deviceType:app.data.deviceType,
    serviceUrl:app.data.serviceUrl,
    simpleImgWidth:0,
    simpleImgHeight:0,

    newcarIconList:'',    //品牌新车列表
    newcarPriceList:[{     //新车价格
      'name':'10-20万',
      'value':'10|20'
    }, {
      'name': '20-40万',
      'value': '20|40'
     }, {     
        'name': '40-80万',
        'value': '40|80'
    }, {
      'name': '80万以上',
      'value': '80|0'
    }],
    oldcarIconList:'',    //品牌二手车列表
    sortList:'',          //有排序列表

  },
  //点击退出
  loginOutFun:function(){
    var _this = this;
    wx.showModal({
      title: '确定退出登录？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.setStorage({
            key: "token",
            data: ""
          })
          app.globalData.token = '';
          _this.setData({
            mtoken:''
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //点击轮播图
  bannerTap:function(e){
    var bannerUrl = e.currentTarget.dataset.url;
    if (bannerUrl){
      wx.navigateTo({
        url: '../det/det?carDetType=banner&bannerUrl=' + bannerUrl
      })
    }
    
  },
  //获取头部轮播图
  bannerImgInit:function(){
    var _this = this;
    wx.request({
      url: this.data.serviceUrl + '/v1/home?token=' + app.globalData.token + '&device_code=' + this.data.deviceType +'&no_cache=1',
      method: 'POST',
      data: {
        page: 1,
        rows: 1,
        type:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == 1){
          for(var li = 0; li < res.data.data.banners.length; li++){
            res.data.data.banners[li].ret_img = res.data.data.banners[li].ret_img.replace(/http:\/\/dycd-static.oss-cn-beijing.aliyuncs.com/, "https://dycd-static-oss.dycd.com")
          }
          _this.setData({
            bannerList:res.data.data.banners
          })
        }
      },
      fail: function () {
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })
  },
  //跳转详情
  goDet:function(e){
    var ctype = e.currentTarget.dataset.cartype;
    var cinfo = e.currentTarget.dataset.carinfo;
    app.globalData.carDetType = ctype;
    app.globalData.carDetId = cinfo.id;
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../det/det?carDetType=' + ctype + '&carDetId=' + cinfo.id
      })
    }
  },
  // 获取首页数据
  listInit: function(carType){
    var _this = this;
    wx.request({
      url: this.data.serviceUrl + '/v1/car/index?token=' + app.globalData.token + '&device_code=' + this.data.deviceType +'&page=1&rows=2&type=1',
      method: 'POST',
      data:{
        v_type: carType,
        version: '33',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == 1){
          for (var li = 0; li < res.data.data.list.length; li++) {
            var timeS = res.data.data.list[li].manufacture;
            var month = new Date(timeS * 1000).getMonth() + 1;
            if (month < 10) {
              month = '0' + String(month)
            }
            var timeObj = new Date(timeS * 1000).getFullYear() + '-' + month
            res.data.data.list[li].manufacture = timeObj
            res.data.data.list[li].img = res.data.data.list[li].img.replace(/http:\/\/dycd-static.oss-cn-beijing.aliyuncs.com/, "https://dycd-static-oss.dycd.com")
          }
          if (carType == 1){
            _this.setData({
              oldCarList: res.data.data.list
            })
          } else if (carType == 2){
            _this.setData({
              newCarList: res.data.data.list
            })
          }
        }else{

        }
      }
    })
  },
  // 获取首页配置数据
  getHomeConfig:function(){
    var _this = this;
    wx.request({
      url: this.data.serviceUrl + '/v2/car.guest/get_homepage_setup?device_code=' + _this.data.deviceType,
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var obj = res.data;
        if (obj.code == 1) {
          var dataObj = obj.data;
          _this.setData({
            sortList: dataObj
          })
          for (var i = 0; i < dataObj.length; i++) {
            if (dataObj[i].module_type == 4){
              _this.setData({
                newcarIconList: dataObj[i].data
              })
            } else if (dataObj[i].module_type == 5) {
              _this.setData({
                oldcarIconList: dataObj[i].data
              })
            }
          }
        }  
      }
    })
  },
  // 切换子页
  changeChildPage: function(event){
    var val = event.currentTarget.dataset.btn;
    if(val == 2){
      wx.redirectTo({
        url: '../newcar/newcar'
      })
    }else if(val == 3){
      wx.redirectTo({
        url: '../oldcar/oldcar'
      })
    }
  },
  //错误提示消息
  showErrorMsg: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  //banner单个加载获取尺寸
  simpleBannerLoad:function(e){
    this.setData({
      simpleImgWidth:e.detail.width,
      simpleImgHeight:e.detail.height
    })
  },
  // 广告区点击跳转
  adTap:function(event){
    // var gourl = event.currentTarget.dataset.gourl;
      var gourl = 'http://bms.dycd.com/platform/car_detail_share.html?id=1211';
    var gotype = event.currentTarget.dataset.gotype;
    console.log(gourl);
    console.log(gotype);
    if (gourl) {
      wx.navigateTo({
        url: '../det/det?carDetType=banner&bannerUrl=' + gourl
      })
    }
  },
  //多图跳转更多
  adMultiMore:function(event){
    var gourl = event.currentTarget.dataset.gourl;
    if (gourl) {
      wx.navigateTo({
        url: '../det/det?carDetType=banner&bannerUrl=' + gourl
      })
    }
  },
  //品牌新车点击
  carSortTap:function(event){
    var brandtype = event.currentTarget.dataset.brandtype;
    var brandid = event.currentTarget.dataset.brandid;
    var brandname = event.currentTarget.dataset.brandname;
    if (brandtype == 'new') {
      wx.navigateTo({
        url: '../newcar/newcar?brandid=' + brandid + '&brandname=' + brandname
      })
    } else if (brandtype == 'old') {
      wx.navigateTo({
        url: '../oldcar/oldcar?brandid=' + brandid + '&brandname=' + brandname
      })
    }
  },
  //品牌新车价格点击
  carPriceSortTap:function(event){
    var pricetype = event.currentTarget.dataset.pricetype;
    var price = event.currentTarget.dataset.price;
    var pricename = event.currentTarget.dataset.pricename;
    if (pricetype == 'new') {
      wx.navigateTo({
        url: '../newcar/newcar?price=' + price + '&pricename=' + pricename
      })
    } else if (pricetype == 'old') {
      wx.navigateTo({
        url: '../oldcar/oldcar?price=' + price + '&pricename=' + pricename
      })
    }
  },
  onLoad: function (options) {
    
    this.listInit(2);
    this.listInit(1);
    this.bannerImgInit();
    this.getHomeConfig();
    
  },
  onReady: function () {

  },
  onShow: function () {
    var _this = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        _this.setData({
          mtoken: res.data
        })
      },
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.listInit(2);
    this.listInit(1);
    this.bannerImgInit();
    this.getHomeConfig();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1000);
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})