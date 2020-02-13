/*
1.发送异步请求  获取分类数据
2.渲染数据
3.点击左侧标题  标题激活选中
  1.给左侧的标题项绑定点击事件 handleMenuTap
  2.点击事件触发的时候
    传递被点击的索引
  3.右侧的数据  跟着切换显示
4.给接口数据  加一个缓存效果
  0.在第一次发动请求成功的时候,先把接口数据  this.Cates缓存起来
  key:"cates"
  value:{catesdata:this.Cates,
    time:当时存下的时间}
  1.在发送请求钱  先判断  有没有旧的数据(小程序中的本地存储)
    1.有旧的数据
      1.判断数据有没有过期
        1.已经过期  再发送请求获取新数据
        2 未过期   才使用旧的数据
     
    2.没有旧的数据 在发送请求获取新数据
  
*/
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js"

Page({
  data: {
    //右侧滚动条的滚动距离
    scrollTop:0,

    //左侧菜单被选中的索引
    currentIndex: 0,
    //左侧的标题数据
    menuList: [],
    //右侧要显示的内容
    googsList: []
  },
  //接口返回值
  Cates: [],
  onLoad() {
    this.loadData()

    //下程序中的同步的本地存储 存值  可以存储任意类型
    //在web中 本地存储  只能存字符串格式 否则会导致数据丢失
  },


  //获取缓存中的数据过去接口中的数据

  loadData() {
    //1 获取本地存储中的数据  值空  字符串
    const localCate = wx.getStorageSync("cates");
    //2.判断该数据是否存在
    if (localCate) {
      //2.1  存在  判断该数据是否过期 1分钟  60s
      if (Date.now() - localCate.time > 1000 * 60) {
        //过期了
        this.getCates()
      } else {
        //没有过期  使用缓存数据
        this.Cates = localCate.data;
        const menuList = this.Cates.map(v => v.cat_name);
        const goodsList = this.Cates[0].children;
        this.setData({
          menuList,
          goodsList,
          scrollTop: 0
        })
      }
    } else {
      this.getCates()
    }

  },
  //获取分类数据
  async getCates() {
    const res= await request({
      url: '/categories'
    })
    this.Cates = res

    //吧数据存入到缓存中
    wx.setStorageSync("cates", {
      data: this.Cates,
      time: Date.now()
    });



    //1.构造左侧要的标题数据
    const menuList = this.Cates.map(v => v.cat_name);
    //2.右侧要的内容数据
    const goodsList = this.Cates[0].children;
    this.setData({
      menuList,
      goodsList
    })

    // request({
    //   url: '/categories'
    // }).then(res => {
    //   // console.log(res)

    //   this.Cates = res.data.message

    //   //吧数据存入到缓存中
    //   wx.setStorageSync("cates", {
    //     data: this.Cates,
    //     time: Date.now()
    //   });



      //1.构造左侧要的标题数据
    //   const menuList = this.Cates.map(v => v.cat_name);
    //   //2.右侧要的内容数据
    //   const goodsList = this.Cates[0].children;
    //   this.setData({
    //     menuList,
    //     goodsList
    //   })
    // })
  },
  //左侧菜单点击事件
  handleMenuTap(e) {
    const {
      index
    } = e.target.dataset;
    const goodsList = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      goodsList
    })
  }
})