/*
1.点击轮播图  切换大图预览
  1.绑定点击事件
  2.调用 小程序中内置的方法wx-previewImage
2.点击家兔购物车
  1.通过使用本地存储来实现缓存数据
  2.要村辖区的数据格式  数组  或者 对象
    [{
      商品id,
      商品名称,
      商品价格,
      图片地址,
      购买的数量----还不能确定
    },{},{}]
  3.点击加入购物车
    1.获取本地存储的数据 要么是一个空字符串 或  是一个[{}]
      let cartList=wx.getStorageSync("carts") || [];
    2.判断当前的商品是否已经存在
     0.当前商品  不存在 第一次购买的时候
     1.需要新增一个对象-购买的数量:1
     2.cartList.push(新增一个对象)
     3.把cartList  重新写入到本地存储中即可
    3.当前的商品已经存在
       1.获取到已经存在的商品对象
       2.对象.购买的数量++
       3.cartList  重新写入到本地存储中即可 
*/

import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js"

// pages/goods_detail/index.js
Page({
  data:{
    //商品的详情数据
    goodsObj:{}
  },
  onLoad: function (options) {
    this.getGoodsDetail(options.goods_id)
  },
  //获取商品详情数据
  //使用async 和 await  来优化异步请求的代码
  async getGoodsDetail(goods_id){
    const  res = await request({
      url:"/goods/detail",
      data:{goods_id}
    })
    this.setData({
          goodsObj:res
        })

    // request({
    //   url:"/goods/detail",
    //   data:{goods_id}
    // }).then(res=>{
    //   console.log(res)
    //   this.setData({
    //     goodsObj:res.data.message
    //   })
    // })
  },
  //点击轮播图
  handleImagePreview(e){
    //获取data中的商品对象
    const {goodsObj}=this.data
    // console.log(goodsObj)
    const urls=goodsObj.pics.map(v=>v.pics_mid_url);
    // console.log(urls)
    const current=e.currentTarget.dataset.current;


    wx.previewImage({
      //被预览的图片路径数组
      urls:urls,
      //被点击的图片的路径
      current:current
    });
      
  },

  //点击加入购物车
  handleCartAdd(){
    //0.获取datavs的商品对象
    const {goodsObj}=this.data;
    //1.获取本地存储中的购物车数据
    let cartList=wx.getStorageSync("carts")||[];
    //2.判断该商品独享是否存在于数组中了
    const index=cartList.findIndex(v=>v.goods_id===goodsObj.goods_id);
    if(index===-1){
      //找不到 第一次新增
      // console.log("第一次新增");
      cartList.push({
        goods_id:goodsObj.goods_id,
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_small_logo:goodsObj.goods_small_logo,
        num:1
      })
       //把数组 存到 缓存中即可
      //  wx.setStorageSync("carts", cartList);
    }else{
      // console.log("找到了")
      //修改商品对象的数量
      cartList[index].num++;
    }
     //把数组 存到 缓存中即可
     wx.setStorageSync("carts", cartList);
     //弹出窗口提示用户
    wx.showToast({
      title: '加入购物车成功',
      // icon: 'success',
      mask:true
    });
      
  }
})