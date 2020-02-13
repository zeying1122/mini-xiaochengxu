// 1.同时发送一部请求的次数
let requestTimes=0;

export const request=(params)=>{
    //2.发弄了几次被递增几个
    requestTimes++;
    //调用小程序内置的loading 效果
    wx.showLoading({
        title: "加载中",
        //遮罩层 true->用户无法再次点击屏幕
        mask: true,
      });
    // 1.公共的url
    const baseUrl="https://api.zbztb.cn/api/public/v1";
   return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success: (result) => {
                //这里优化一下.后面拿到的数据都要result.data.message,所以直接在这里做一个优化
                if(result.data.meta && result.data.meta.status===200){
                    resolve(result.data.message);
                }else{
                    reject(result);
                }
            },
            fail: (err) => {
                reject(err)
            },
            complete:()=>{
                requestTimes--;
                requestTimes===0 && wx.hideLoading();
            }
        })  
    })
}
