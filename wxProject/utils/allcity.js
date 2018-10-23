var city = [];
var app = getApp();
//获取车品牌列表
var getCarsBrandList = function () {
  //var _this = this;
  wx.request({
    url: app.data.serviceUrl + '/v1/home/brand?token=' + app.data.mtoken + '&device_code=' + app.data.deviceType + '&page=1&rows=2&type=1',
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
        //_this.setData({
        city= res.data.data
        //city: City
        //})
        console.log(99923123123123)
        console.log(city)
      } else {

      }
    }
  })
}
getCarsBrandList()

module.exports = city;