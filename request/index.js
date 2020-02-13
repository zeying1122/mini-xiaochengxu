// 1.同时发送一部请求的次数
let requestTimes=0;

/*
promise 形式的 异步代码
@param {object} params 请求的参数
*/

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

/*
Promise 形式的getSetting
*/
export const getSetting=()=>{
    return new  Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                 reject(err);
            }
        });
    })
}

/*
Promise 形式的openSetting
*/
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resole(tesult)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}

/*
Promise 形式的chooseAddress
*/
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

