Page({
  onLoad() {
    wx.http({
      url: '/goods',
      success(res) {
        console.log(res)
      },
    })

    const errMsg = wx.http<{ errMsg: string }>({
      url: '/goods',
    })

    console.log(errMsg)
  },
})
