import http from '@botue/wechat-http'

http.baseURL = 'https://yapi.itheima.net/mock/30'

http.intercept.request = (params) => {
  // 请求头信息
  params.header = Object.assign({}, params.header, {
    Authorization: 'Bearer <token>',
  })

  return params
}

http.intercept.response = ({ data }) => {
  return data
}

// 挂载到全局对象
wx.http = http

export default http
