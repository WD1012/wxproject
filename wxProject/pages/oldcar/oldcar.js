// pages/oldcar/oldcar.js
const app = getApp();

Page({
  data: {
    userip:'',
    mtoken: app.globalData.token,
    deviceType: app.data.deviceType,
    serviceUrl: app.data.serviceUrl,
    childPage: '3',    //1:首页   2：新车  3：二手车
    searchInput:'',     //搜索内容
    city: {},           //车品牌
    cityData:{},        //地址
    bodyColorList:{},
    priceList:{},
    priceShow:'',
    menuChoose_1:false,
    menuChoose_2: false,
    menuChoose_3: false,
    menuChoose_4: false,
    menuChoose_5: false,
    currentMenuChoose:'',
    brandStep:1,
    searStatus:false,
    searchText:'',
    carList:[],       //车列表
    carBrandList:{},  //车品牌列表
    rulesList:{},   //车规规则列表
    car_brand_id:0,     //品牌id
    car_car_color:'',   //车身颜色
    car_city_id:0 ,     //城市id
    car_coty:'',        //车龄
    car_dealer_price:'', //车价格
    carPriceName:'',      //车价格文字
    carOrderName:'',      //车排序名字
    car_emission_standards:'',  //排放标准
    car_first_type:'',          //一级车规
    car_init_coty:'',     //车龄
    car_keyword:'',      //关键词
    car_mileage:'',       //里程
    car_model_id:0,     //车型id
    car_model_name:'',  //车型名称
    car_natur_use:'',   //车是否运营
    car_order_type: 0,   //排序 1: 按发布时间,降序；2: 按里程，升序；3:按车龄，升序；4:按价格，升序；5:按发布时间,升序6:按里程，降序；7:按车龄，降序；8:按价格，降序；
    car_page:1,         //页码
    car_prov_id:'',     //省份id
    car_provice_id:0,   //省份id
    car_rows:10,        //每页条数
    car_second_type:'', //二级车规，新车有效
    car_series_id:0,    //车系id
    car_start:0,         //初始为0
    car_type: 0,         //3-本省车源、4-全部车源 1 查询意向车源,2查询推荐车源
    car_v_type: 1,         //1:二手车 2:新车 3:平行进口车
    haveNextPage:1,     //是否有下一页 1有 2没有
    searchHistory:[],   //搜索历史
    carModelList:[],    //车型列表
    chooseCarModel:{},   //选择的车型
    chooseCity:{},        //选择的城市
    seriesName:'',      //选择车系名字
    list: [],
    rightArr: [],// 右侧字母展示
    rightArrCity:[],
    jumpNum: '',//跳转到那个字母
    myCityName: '请选择', // 默认我的城市
    emissionStandards:[],    //排放标准列表
    autoUse:[],           //营运性质
    autoAge:[],           //车龄
    listIsNull: false,     //列表为空
    minPrice: '',
    maxPrice: '',
    minAge: '',
    maxAge: '',
  },

  onLoad: function (options) {

    if (options.brandid && options.brandname) {
      this.setData({
        car_brand_id: options.brandid,
        seriesName: options.brandname
      })
    }
    if (options.price && options.pricename) {
      this.setData({
        car_dealer_price: options.price,
        carPriceName: options.pricename
      })
    }

    var _this = this;
    this.getCarsBrandList();
    this.getCityList();
    this.getUserIp();
    wx.getStorage({
      key: 'searchListArr',
      success: function (res) {
        _this.setData({
          searchHistory: res.data
        })
      }
    })
    
    

  },
  //跳转详情
  goDet: function (e) {
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
  // 数据重新渲染
  resetRight:function(data) {
    let rightArr = []
    for (let i in data) {
      rightArr.push(String(data[i].title).substr(0, 1));
    }
    this.setData({
      list: data,
      rightArr
    })
  },
  // 数据重新渲染
  resetRightCity: function (data) {
    let rightArrCity = []
    for (let i in data) {
      rightArrCity.push(String(data[i].initial).substr(0, 1));
    }
    this.setData({
      list: data,
      rightArrCity:rightArrCity
    })
  },




  //获取地址列表
  getCityList:function(){
      var _this = this;
      wx.request({
        url: this.data.serviceUrl + '/v2/car.guest/area_list?device_code=' + _this.data.deviceType + '&format=1&status=1',
        method: 'POST',
        data: {
          device_code: _this.data.deviceType,
          format: 1,
          status: 1,
          version: '33',
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var dataArr = res.data.data;
          if (res.data.code == 1) {
            _this.setData({
              cityData: res.data.data
            })
            _this.resetRightCity(_this.data.cityData)
          } else {

          }
        }
      })
  },
  //获取车品牌列表
  getCarsBrandList:function(){
    var _this = this;
    wx.request({
      url: this.data.serviceUrl + '/v1/home/brand?token=' + app.globalData.token + '&device_code=' + this.data.deviceType + '&page=1&rows=2&type=1',
      method: 'POST',
      data: {
        version: '33',
        status:1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          _this.setData({
            city: res.data.data
            // city:City
          })
          _this.resetRight(_this.data.city);
        } else {

        }
      }
    })
  },
  // 右侧字母滚动事件
  jumpMtScroll(e) {
    var list = this.data.rightArrCity;
    var moveY = e.touches[0].clientY;
    var rY = moveY - 120;
    if (rY >= 0) {
      let index = Math.ceil((rY - 18) / 18);
      if (this.data.jumpNum != ('index' + list[index]) && 0 <= index < list.length) {
        let nonwAp = list[index];
        var indexNum = 'index' + nonwAp
        nonwAp && this.setData({ jumpNum: indexNum });
      }
    }
  },
  // 右侧字母点击事件
  jumpMt(e) {
    var jumpNum = 'index' + e.currentTarget.dataset.id;
    this.setData({ jumpNum });
  },
  jumpMtCar(e) {
    var jumpNum = e.currentTarget.dataset.id;
    this.setData({ jumpNum });
  },
  //点击城市
  detailMtCity(e) {
    var _this = this;
    let detail = e.currentTarget.dataset.detail;

    _this.setData({
      chooseCity: detail,
      car_city_id: detail.city_id,
    });
    this.getCarsList()
  },
  //点击品牌
  detailMt(e) {
    var _this = this;
    let detail = e.currentTarget.dataset.detail;

    _this.setData({
      brandStep:2,
      chooseCarModel: detail
    });
    this.getCarForBrand(detail)
  },
  //点击不限品牌
  brandAll:function () {
    this.setData({
      car_brand_id: 0,     //车型id
      car_series_id: 0,
      seriesName: '',  //车型名称
    });
    this.hidAllMenu();
    this.getCarsList();
  },
  //点击车型蒙版
  hidModelList:function(){
    this.setData({
      brandStep: 1
    })
  },
  //根据品牌获得车系
  getCarForBrand: function (detail){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: this.data.serviceUrl + '/v1/home/series?token=' + app.globalData.token + '&device_code=' + this.data.deviceType,
      method: 'POST',
      data:{
        brand_id: detail.brand_id,
        status:1,
        version:'33'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          _this.setData({
            carModelList: res.data.data,
          })
        } else {
          _this.showErrMsg(res.data.data.msg)
        }
      },
      fail: function () {
        wx.hideLoading()
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })

  },
  //选择车型
  chooseModel:function(e){
    var info = e.currentTarget.dataset.modelinfo;
    this.setData({
      car_series_id: info.series_id,     //车型id
      seriesName: info.series_name,  //车型名称
      brandStep: 1,
      menuChoose_1:false,
    })
    this.getCarsList();
  },
  //全车型
  allModel: function () {
    var _this = this;
    this.setData({
      car_series_id: 0,
      car_brand_id: _this.data.chooseCarModel.brand_id,
      seriesName: _this.data.chooseCarModel.brand_name,
    })
    this.getCarsList();
  },
  //全国
  cityAll: function () {
    this.setData({
      chooseCity: {},
      car_city_id: 0,
    });
    this.getCarsList()
  },
  //选择车身颜色
  chooseBodyColor:function(e){
      var bodyColor = e.currentTarget.dataset.bodycolor;
      var bodyColorId = e.currentTarget.dataset.bodycolorid;
      if (this.data.car_car_color == bodyColorId) {
        this.setData({
          car_car_color: ''
        })
      } else {
        this.setData({
          car_car_color: bodyColorId
        })
      }
  },
  //选择车规
  chooseRules:function(e){
    var rulekey = e.currentTarget.dataset.rulekey;
    var ruleid = e.currentTarget.dataset.ruleid;
    if (this.data.car_emission_standards == ruleid) {
      this.setData({
        car_emission_standards: ''
      })
    } else {
      this.setData({
        car_emission_standards: ruleid
      })
    }
  },
  //选择营运
  chooseUse:function(e){
    var rulekey = e.currentTarget.dataset.rulekey;
    var ruleid = e.currentTarget.dataset.ruleid;
    if (this.data.car_natur_use == ruleid) {
      this.setData({
        car_natur_use: ''
      })
    } else {
      this.setData({
        car_natur_use: ruleid
      })
    }
  },
  //输入年限
  ageInput: function (e) {
    var type = e.currentTarget.dataset.inputtype;
    var value = e.detail.value;
    var carprice = this.data.car_coty;
    var carpriceArr = ['', ''];
    if (carprice.indexOf("|") != -1) {
      carpriceArr = carprice.split("|");
    } else {
      carpriceArr = ['', '']
    }
    carpriceArr[type] = value;
    this.setData({
      car_coty: carpriceArr[0] + "|" + carpriceArr[1],
    })
  },
  //输入价格
  priceInput:function(e){
    var type = e.currentTarget.dataset.inputtype;
    var value = e.detail.value;
    var carprice = this.data.car_dealer_price;
    var carpriceArr = ['', ''];
    if(carprice.indexOf("|") != -1){
      carpriceArr = carprice.split("|");
    }else{
      carpriceArr = ['','']
    }
    carpriceArr[type] = value;
    this.setData({
      car_dealer_price: carpriceArr[0] + "|" + carpriceArr[1],
      carPriceName: ''
    })
  },
  //选择价格
  choosePrice:function(e){
    var priceValue = e.currentTarget.dataset.filcont;
    var priceId = e.currentTarget.dataset.filid;
    
    if (this.data.car_dealer_price == priceValue) {
      this.setData({
        car_dealer_price: ''
      })
    } else {
      this.setData({
        car_dealer_price: priceValue
      })
    }
  },
  //选择年限
  chooseAge:function(e) {
    var priceValue = e.currentTarget.dataset.filcont;
    var priceId = e.currentTarget.dataset.filid;

    if (this.data.car_coty == priceValue) {
      this.setData({
        car_coty: ''
      })
    } else {
      this.setData({
        car_coty: priceValue
      })
    }
  },
  //获取用户ip
  getUserIp:function(){
    var _this = this;
    // wx.request({
    //   url: 'http://ip-api.com/json',
    //   success: function (e) {
    //     _this.setData({
    //       userip: e.data.query
    //     })
        _this.getConfig();
        _this.getCarsList();
    //   }
    // })
    
  },
  //获取基础配置接口
  getConfig: function(){
    var _this = this;
    wx.request({
      url: this.data.serviceUrl + '/v1/car/config?token=' + app.globalData.token + '&device_code=' + this.data.deviceType,
      method: 'POST',
      data: {
        version: '33',
        call_sign:'',
        device_code: this.data.deviceType,
        user_id: 132132,
        user_ip: this.data.userip,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          _this.setData({
            bodyColorList: res.data.data.auto_body_color,
            rulesList:res.data.data.auto_standard,
            priceList: res.data.data.auto_price,
            emissionStandards: res.data.data.auto_es,
            autoUse:res.data.data.auto_use,
            autoAge: res.data.data.auto_age
          })

        } else {

        }
      }
    })
  },
  //查看全部-默认
  carListRest:function(){
    this.setData({
      car_brand_id: 0,     //品牌id
      car_car_color: '',   //车身颜色
      car_city_id: 0,     //城市id
      car_coty: '',        //车龄
      car_dealer_price: '', //车价格
      carPriceName: '',      //车价格文字
      carOrderName: '',      //车排序名字
      car_emission_standards: '',  //排放标准
      car_first_type: '',          //一级车规
      car_init_coty: '',     //车龄
      car_keyword: '',      //关键词
      car_mileage: '',       //里程
      car_model_id: 0,     //车型id
      car_model_name: '',  //车型名称
      car_natur_use: '',   //车是否运营
      car_order_type: 0,   //排序 1: 按发布时间,降序；2: 按里程，升序；3:按车龄，升序；4:按价格，升序；5:按发布时间,升序6:按里程，降序；7:按车龄，降序；8:按价格，降序；
      car_page: 1,         //页码
      car_prov_id: '',     //省份id
      car_provice_id: 0,   //省份id
      car_rows: 10,        //每页条数
      car_second_type: '', //二级车规，新车有效
      car_series_id: 0,    //车系id
      car_start: 0,         //初始为0
      car_type: 0,         //3-本省车源、4-全部车源 1 查询意向车源,2查询推荐车源

      haveNextPage: 1,     //是否有下一页 1有 2没有
      searchHistory: [],   //搜索历史
      carModelList: [],    //车型列表
      chooseCarModel: {},   //选择的车型
      chooseCity: {},        //选择的城市
      listIsNull: false,     //列表为空
      minPrice: '',
      maxPrice: '',
      minAge: '',
      maxAge: '',
    });
    this.getCarsList();
  },
  // 获取车列表接口-分页
  getCarsListLoad: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: this.data.serviceUrl + '/v1/car/index?token=' + app.globalData.token + '&device_code=' + this.data.deviceType,
      method: 'POST',
      data: {
        version: '33',
        brand_id: _this.data.car_brand_id,     //品牌id
        car_color: _this.data.car_car_color,   //车身颜色
        city_id: _this.data.car_city_id,     //城市id
        coty: _this.data.car_coty,        //车龄
        dealer_price: _this.data.car_dealer_price, //车价格
        emission_standards: _this.data.car_emission_standards,  //排放标准
        first_type: _this.data.car_first_type,          //一级车规
        init_coty: _this.data.car_init_coty,     //车龄
        keyword: _this.data.car_keyword,      //关键词
        mileage: _this.data.car_mileage,       //里程
        model_id: _this.data.car_model_id,     //车型id
        model_name: _this.data.car_model_name,  //车型名称
        nature_use: _this.data.car_natur_use,   //车是否运营
        order_type: _this.data.car_order_type,   //排序 1: 按发布时间,降序；2: 按里程，升序；3:按车龄，升序；4:按价格，升序；5:按发布时间,升序6:按里程，降序；7:按车龄，降序；8:按价格，降序；
        page: _this.data.car_page,         //页码
        prov_id: _this.data.car_prov_id,     //省份id
        provice_id: _this.data.car_provice_id,   //省份id
        rows: _this.data.car_rows,        //每页条数
        second_type: _this.data.car_second_type, //二级车规，新车有效
        series_id: _this.data.car_series_id,    //车系id
        start: _this.data.car_start,         //初始为0
        type: _this.data.car_type,         //3-本省车源、4-全部车源 1 查询意向车源,2查询推荐车源
        v_type: _this.data.car_v_type          //1:二手车 2:新车 3:平行进口车

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          var oldList = [];
          if (_this.data.car_page == 1) {
            _this.setData({
              carList: []
            })
          }
          oldList = _this.data.carList;
          for (var li = 0; li < res.data.data.list.length; li++){
            var timeS = res.data.data.list[li].manufacture;
            var month = new Date(timeS * 1000).getMonth() + 1;
            if(month < 10){
              month = '0' + String(month)
            }
            var timeObj = new Date(timeS * 1000).getFullYear() + '-' + month
            res.data.data.list[li].manufacture = timeObj
            res.data.data.list[li].img = res.data.data.list[li].img.replace(/http:\/\/dycd-static.oss-cn-beijing.aliyuncs.com/, "https://dycd-static-oss.dycd.com")
          }
          for (var i = 0; i < res.data.data.list.length; i++) {
            oldList.push(res.data.data.list[i])
          }
          _this.setData({
            carList: oldList,
            haveNextPage: (res.data.data.status || 2)
          })
        } else {

        }
      },
      fail: function () {
        wx.hideLoading()
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })
  },
  // 获取车列表接口
  getCarsList:function(){
    var _this = this;
    this.setData({
      car_page:1
    })
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: this.data.serviceUrl + '/v1/car/index?token=' + app.globalData.token + '&device_code=' + this.data.deviceType,
      method: 'POST',
      data: {
        version: '33',
        brand_id: _this.data.car_brand_id,     //品牌id
        car_color: _this.data.car_car_color,   //车身颜色
        city_id: _this.data.car_city_id,     //城市id
        coty: _this.data.car_coty,        //车龄
        dealer_price: _this.data.car_dealer_price, //车价格
        emission_standards: _this.data.car_emission_standards,  //排放标准
        first_type: _this.data.car_first_type,          //一级车规
        init_coty: _this.data.car_init_coty,     //车龄
        keyword: _this.data.car_keyword,      //关键词
        mileage: _this.data.car_mileage,       //里程
        model_id: _this.data.car_model_id,     //车型id
        model_name: _this.data.car_model_name,  //车型名称
        nature_use: _this.data.car_natur_use,   //车是否运营
        order_type: _this.data.car_order_type,   //排序 1: 按发布时间,降序；2: 按里程，升序；3:按车龄，升序；4:按价格，升序；5:按发布时间,升序6:按里程，降序；7:按车龄，降序；8:按价格，降序；
        page: _this.data.car_page,         //页码
        prov_id: _this.data.car_prov_id,     //省份id
        provice_id: _this.data.car_provice_id,   //省份id
        rows: _this.data.car_rows,        //每页条数
        second_type: _this.data.car_second_type, //二级车规，新车有效
        series_id: _this.data.car_series_id,    //车系id
        start: _this.data.car_start,         //初始为0
        type: _this.data.car_type,         //3-本省车源、4-全部车源 1 查询意向车源,2查询推荐车源
        v_type: _this.data.car_v_type,          //1:二手车 2:新车 3:平行进口车

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1) {
          var oldList = [];
          if (_this.data.car_page == 1) {
            _this.setData({
              carList:[]
            })
          }
          oldList = _this.data.carList; 
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
          for (var i = 0; i < res.data.data.list.length; i++){
            oldList.push(res.data.data.list[i])
          }
         
          _this.setData({
            carList: oldList,
            haveNextPage: (res.data.data.status || 2),
            listIsNull: false,     //列表为空
          })
          if(_this.data.carList.length == 0){
            _this.setData({
              listIsNull: true,     //列表为空
            })
          }
          _this.hidAllMenu();
        } else {

        }
      },
      fail: function () {
        wx.hideLoading()
        _this.showErrorMsg('网络错误，请稍后重试')
      }
    })
  },
  binddetail(e) {
    this.hidAllMenu()
    // 返回 例 :{name: "北京", key: "B", test: "testValue"}
  },
  binddetailBrand(e){
    this.hidAllMenu()
    // 返回 例 :{name: "北京", key: "B", test: "testValue"}
  },
  //点击筛选确定按钮
  filterConfirm:function(){
    this.getCarsList();
    this.hidAllMenu()
  },
  //点击菜单选项
  filterTap:function(e){
    var mtype = e.currentTarget.dataset.filtype;
    var mcont = e.currentTarget.dataset.filcont;
    var mtext = e.currentTarget.dataset.filtext;
    if(mtype == 'price'){
      this.setData({ car_dealer_price:mcont,carPriceName:mtext});
    }
    if (mtype == 'order') {
      this.setData({ car_order_type: mcont,carOrderName:mtext});
    }

    
    this.getCarsList()
    this.hidAllMenu()
  },
  //搜索赋值
  setSearchText:function(e){
    this.setData({
      car_keyword:e.detail.value
    })
  },
  //清空查询记录
  clearSearchHis: function(){
    wx.setStorage({
      key: "searchListArr",
      data: []
    })
    this.setData({
      searchHistory: []
    })
    this.hidAllMenu();
  },
  //点击搜索按钮
  searchFun:function(){
    var _this = this;
    var searchHisArr = this.data.searchHistory;
    if (this.data.car_keyword) {
      if(searchHisArr.length >= 20){
        searchHisArr.pop();
      }
      searchHisArr.unshift(_this.data.car_keyword);
      _this.setData({
        searchHistory: searchHisArr
      })
      wx.setStorage({
        key: "searchListArr",
        data: searchHisArr
      })
      _this.getCarsList();
    }
    this.hidAllMenu();
  },
  //点击搜索历史
  hisSearchBtn:function(e){
    this.setData({
      car_keyword:e.currentTarget.dataset.searchval
    })
    this.getCarsList();
    this.hidAllMenu()
  },
  //点击搜索框
  tapSearch:function(){
    this.setData({
      searStatus:true,
      car_keyword: ''
    })
    
  },
  //隐藏所有菜单
  hidAllMenu:function(){
    this.setData({
      menuChoose_1: false,
      menuChoose_2: false,
      menuChoose_3: false,
      menuChoose_4: false,
      menuChoose_5: false,
      brandStep: 1,
      searStatus: false,
      searchText: '',
      brandStep:1,
      currentMenuChoose: '',
      brandStep: 1,
    });
  },
  //选择菜单
  checkFilter: function(e){
    var mtype = e.currentTarget.dataset.menu;
    this.setData({
      menuChoose_1: false,
      menuChoose_2: false,
      menuChoose_3: false,
      menuChoose_4: false,
      menuChoose_5: false,
    });
    var _this = this;
    if(this.data.currentMenuChoose == mtype){
      switch (mtype) {
        case 'm1':
          _this.setData({ menuChoose_1: false })
          break;
        case 'm2':
          _this.setData({ menuChoose_2: false })
          break;
        case 'm3':
          _this.setData({ menuChoose_3: false })
          break;
        case 'm4':
          _this.setData({ menuChoose_4: false })
          break;
        case 'm5':
          _this.setData({ menuChoose_5: false })
          break;
        default:
          break;
      }
      this.setData({ currentMenuChoose: '' })
    }else{
      switch (mtype) {
        case 'm1':
          _this.setData({ menuChoose_1: true })
          break;
        case 'm2':
          _this.setData({ menuChoose_2: true })
          break;
        case 'm3':
          _this.setData({ menuChoose_3: true })
          break;
        case 'm4':
          _this.setData({ menuChoose_4: true })
          break;
        case 'm5':
          _this.setData({ menuChoose_5: true })
          break;
        default:
          break;
      }
      this.setData({ currentMenuChoose: mtype })
    }
  },
  // 切换子页
  changeChildPage: function (event) {
    
    var val = event.currentTarget.dataset.btn;
    this.setData({
      childPage: val
    })
    if(val == 1){
      wx.redirectTo({
        url: '../index/index'
      })
    }else if(val == 2){
      wx.redirectTo({
        url: '../newcar/newcar'
      })
    }
  },
  //输入监听
  searchInputListen: function(e){
    this.setData({
      car_keyword:e.detail.value
    })

  },
  //上拉加载
  loadMore:function(){
    if (this.data.haveNextPage != 1){
      return false;
    }
    var page = this.data.car_page;
    page = page + 1;
    this.setData({
      car_page: page
    })
    this.getCarsListLoad();

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
    if(this.data.menuChoose_1 || this.data.menuChoose_2 || this.data.menuChoose_3 || this.data.menuChoose_4 || this.data.menuChoose_5){
      wx.stopPullDownRefresh();
      return false;
    }
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          deviceHeight: res.windowHeight
        })
      }
    })

    this.hidAllMenu()
    this.carListRest();
    this.getCarsBrandList();
    this.getCityList();
    this.getUserIp();
    wx.getStorage({
      key: 'searchListArr',
      success: function (res) {
        _this.setData({
          searchHistory: res.data
        })
      }
    })

    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  onReachBottom: function () {
    this.loadMore()
  },
  onShareAppMessage: function () {

  }
})