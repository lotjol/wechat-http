interface Goods {
  goods_id: string
  goods_name: string
  godos_price: string
}

Page({
  async onLoad() {
    // wx.http({
    //   url: '/goods',
    //   success(res) {
    //     console.log(res)
    //   },
    // })

    // const goods = await wx.http<Goods[]>({
    //   url: '/goods',
    // })

    // const goods = await wx.http.get<Goods[]>('/goods')

    const goods = await wx.http.post<Goods[]>('/goods')
  },
})
