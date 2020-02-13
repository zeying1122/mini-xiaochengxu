/* 首页
1,获取接口数据  轮播图 
2.使用封装好的一部代码来发送请求
  1.在小程序中要引入js文件的话,建议把路径补全
  2.在被导出的js中  使用
  export const 变量名
  在导入的时候 直接通过  结构的代码来获取
  import  {变量名}  from  "路径";
3.统一在request文件中加入了调用的loading方法
  1.需要在同时发送出去的请求都回来了再去接loading
  */

import {request} from "../../request/index.js"

Page({
  data: {
    //轮播图数组
    swiperList: [],
    //导航
    catitemsList:[],
    //楼层
    floorList:[]
  },
  onLoad() {
    //调用小程序内置的loading 效果
    // wx.showLoading({
    //   title: "加载中",
    //   //遮罩层 true->用户无法再次点击屏幕
    //   mask: true,
    // });
    // setTimeout(() => {
    //   wx.hideLoading();
    // }, 3000);
      
    //轮播图
    this.getSwiperData(),
    //导航
    this.getCatitems(),
    // 楼层数组
    this.getFloorList()
  },
  //获取轮播图  数据
  getSwiperData() {
    request({
      url: '/home/swiperdata'
    }).then(result=>{
      this.setData({
        swiperList:result
      })
    })

  },
  //导航
  getCatitems(){
    request({
      url: '/home/catitems'
    }).then(result=>{
      this.setData({
        catitemsList: result
      })
    })
  },
  //楼层
  getFloorList(){
    request({
      url: '/home/floordata'
    }).then(result=>{
      this.setData({
        floorList: result
      })
    })
  }
})