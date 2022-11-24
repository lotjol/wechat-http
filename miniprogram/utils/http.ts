import http from 'wechat-http'

http.baseURL = 'https://yapi.itheima.net/mock/30'

http.intercept.request = (options) => {
  // 请求头信息
  options.header = Object.assign({}, options.header, {
    Authorization: 'Bearer <token>',
  })
  return options
}

http.intercept.response = (result) => {
  return result.data
}

// 挂载到全局对象
wx.http = http

export default http
