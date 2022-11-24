Page({
  async onLoad() {
    // wx.http({
    //   url: '/goods',
    //   success(res) {
    //     console.log(res)
    //   },
    // })
    // 普通调用方式
    // const goods = await wx.http({
    //   url: '/goods',
    // })
    // console.log(goods)
    const goods = await wx.http.get('/goods')
    console.log(goods.data)
  },
})
