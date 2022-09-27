import http from '../../utils/miniprogram-request'

http.intercept.request = (params) => {
  return params
}

http.intercept.response = (response) => {
  console.log(response)
  return {}
}

http.loading = {
  title: '不在加载...',
  mask: true,
}

http.baseURL = 'https://yapi.itheima.net/mock/30'

Page({
  async onLoad() {
    http(
      {
        url: '/goods',
        success() {
          console.log('ok')
        },
      }
      // { showLoading: false }
    )

    await http({
      url: '/goods',
    })
  },
})
