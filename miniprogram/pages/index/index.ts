Page({
  getData01() {
    // 网络请求 - 原生调用方式 wx.request
    wx.request({
      method: 'GET',
      url: wx.http.baseURL + '/home/banner',
      success(res) {
        console.log(res)
      },
    })
  },
  async getData02() {
    // Promise 封装调用方式 wx.http
    const res = await wx.http({
      method: 'GET',
      url: '/home/banner',
      data: { distributionSite: 1 },
      header: {
        Aaaaa: 111111111,
      },
    })
    console.log(res)
  },

  async getData03() {
    // Promise 封装调用方式 wx.http.get
    const res = await wx.http.get(
      '/home/banner',
      { distributionSite: 2 },
      {
        header: {
          Bbbbb: 222222222,
        },
      }
    )
    console.log(res)
  },
  // -------------------------------
  async upload01() {
    // 选择文件
    const { tempFiles } = await wx.chooseMedia({ count: 1 })
    // 上传文件 - 原生调用方式  wx.uploadFile
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      name: 'file',
      filePath: tempFiles[0].tempFilePath,
      success(res) {
        console.log('🟢🟢', res)
      },
    })
  },
  async upload02() {
    // 选择文件
    const { tempFiles } = await wx.chooseMedia({ count: 1 })
    // 上传文件 - Promise 封装调用方式 wx.http
    const res = await wx.http({
      method: 'UPLOAD',
      url: 'https://live-api.itheima.net/upload',
      name: 'file',
      filePath: tempFiles[0].tempFilePath,
      formData: {
        type: 'avatar',
      },
    })

    console.log('🟠🟠', res)
  },

  async upload03() {
    // 选择文件
    const { tempFiles } = await wx.chooseMedia({ count: 1 })
    // 上传文件 - Promise 封装调用方式 wx.http.upload
    const res = await wx.http.upload('/upload', {
      name: 'file',
      filePath: tempFiles[0].tempFilePath,
      formData: {
        type: 'avatar',
      },
    })

    console.log('🟣🟣', res)
  },
})
