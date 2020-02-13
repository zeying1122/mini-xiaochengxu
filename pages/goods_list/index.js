 
/*
1.上拉加载 数据
   1 先找到上拉滚动条触底事件(在页面的生命周期中见过onReachBottom())
   2.先判断  有没有下一页数据(页码.页容量.总条数)
     1.获取到总页数  9页
        总页数=Math.ceil(总条数  /  页容量)
     2.只要拿到当前的页码1  和  总页数做个判断
    3. 当当前的页码  大于或者等于 总页码
      没有下一页数据
      否则 还有下一页数据
    4.确定有下一页数据
      1 页码++
      2 重新发送异步请求(bug  需要拿新旧数据做一个拼接即可)
    5.没有 下一页数据
      弹窗提示用户即可!!
2.下拉刷新
   1.需要在页面的json文件中  开启  下拉刷新
     "enablePullDownRefresh": true,
     "backgroundTextStyle": "dark"
     2.监听时间    onPullDownRefresh
     3.事件触发
       1.重置页面  ->  重置数据
         1.重置页面  pagenum: 1,  goodsList:[]
         2.发送异步请求  获取数据 ()
        2.等待数据都回来  手动关闭  下拉组件!!



*/
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
    request
} from "../../request/index.js"

Page({
    data: {
        titleList: [{
                id: 0,
                text: '综合'
            },
            {
                id: 1,
                text: '销量'
            },
            {
                id: 2,
                text: '价格'
            }
        ],
        currentIndex: 0,
        //页面显示的数组
        goodsList:[],
        //还有没有数据
        isNoMore:false
    },
    //全局的请求参数对象
    QueryParams: {
        //查询关键字  可以为空
        query: "",
        //分类id 从分类页面  传递过来
        cid: "",
        //页码  第几页
        pagenum: 1,
        //页容量 一页可以放几条数据
        pagesize: 10
    },
    //总页数
    TotalPages:1,


    onLoad(options) {
        const {
            cid
        } = options;
        this.QueryParams.cid = cid;
        this.getGoodsList();
    },
    //获取商品列表数据
    async getGoodsList() {
        const res= await request({
            url: "/goods/search",
            data: this.QueryParams
        })
           //接口返回的新数组
            const newGoodsList=res.goods;
            //获取data中的旧数组
            const beforGoodsList=this.data.goodsList;
            //总条数
            const  total=res.total;
            //计算总页数
            this.TotalPages=Math.ceil(total / this.QueryParams.pagesize);
            
            this.setData({
                goodsList:[...beforGoodsList,...newGoodsList]
            });
            //关闭下拉刷新组件
            wx.stopPullDownRefresh();


        // request({
        //     url: "/goods/search",
        //     data: this.QueryParams
        // }).then(res => {
        //     //接口返回的新数组
        //     const newGoodsList=res.data.message.goods;
        //     //获取data中的旧数组
        //     const beforGoodsList=this.data.goodsList;
        //     //总条数
        //     const  total=res.data.message.total;
        //     //计算总页数
        //     this.TotalPages=Math.ceil(total / this.QueryParams.pagesize);
            
        //     this.setData({
        //         goodsList:[...beforGoodsList,...newGoodsList]
        //     });
        //     //关闭下拉刷新组件
        //     wx.stopPullDownRefresh();
        // })
    },

    //滚动条触底事件
    onReachBottom(){
      //1.判断有没有下一页数据
      if(this.QueryParams.pagenum>=this.TotalPages){
          //没有下一页
          wx.showToast({
              title: '已经到底部了喔',
              icon: 'none',
          });
          this.setData({
            isNoMore:true
          })
            
      }else{
          //有下一页数据
          this.QueryParams.pagenum++;
          //重新发送异步请求.
          this.getGoodsList();
      }
    },
     
    //页面下拉刷新事件
    onPullDownRefresh: function () {
        //重置  页码
        this.QueryParams.pagenum=1;
        //重置data中的商品数组
        this.setData({
            goodsList:[]
        });
        //重新发送异步请求
        this.getGoodsList();
    },

    handleItemChange(e) {
        this.setData({
            currentIndex: e.detail.index
        })
    }
})