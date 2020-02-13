// pages/cart/index.js
/*
1.如何合理的获取 收货地址
  0.当用户点击了"拒绝"之后,第二次再点击的时候  无法再获取收货地址(有区别于其他  获取用户信息)
  1.先检查  用户的授权-获取收货地址  状态  auth
  2.auth  表示 用户是否曾经给过  权限
    1.auth=false 点击了 "取消"
      1.要诱导用户  自己 打开 "授权页面"让用户自己给权限
      2.直接获取用户的收货地址
    2.auth=true  表示  用户曾经 点击了 "允许"
    3.auth=undefined 表示 用户 没有点击过取消和允许
      当用户满足2.3的状态 直接获取用户的收货地址
  3.通过async的代码 来简化以上过程
    1.把 wx.getSetting 、wx.openSetting、wx.chooseAddress
    改成promise的形式
*/
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
    getSetting,openSetting,chooseAddress
} from "../../request/index.js"

Page({
  handleTap(){
    // wx.getSetting({
    //   success: (result1) => {
    //     const auth=result1.authSetting["scope.address"];
    //     //2.当auth=false
    //     if(auth===false){
    //       //2.1诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           //2.2直接获取用户的  收货地址
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             },
    //             fail:()=>{},
    //             complete:()=>{}
    //           });
    //         }
    //       });
    //     }else{
    //       //auth  true||underfined
    //       wx.chooseAddress({
    //         success: (result3) => {
    //           console.log(result3)
    //         },
    //         fail:()=>{},
    //         complete:()=>{}
    //       });
    //     }
    //   }
    // });
      

    //现在已经包装好的了
    //获取用户  对于 收货地址的授权状态
    this.getUserAddress();
  
  },
   async getUserAddress(){
     //1.获取用户的授权转态
     const result=await getSetting();
     const auth=result.authSetting["scope.address"];
     //2.判断授权状态
     if(auth===false){
       await openSetting();
     }
     const result2=await chooseAddress();
     console.log(result2)
  },

  handUser(){
    wx.chooseAddress({
      success: (result) => {
        console.log(result) 
      }
    });
      
  }

})