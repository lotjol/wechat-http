import http from 'wechat-http'

http.baseURL = 'https://pcapi-xiaotuxian-front.itheima.net/'

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjI4Njc3OTM0MjAyODgiLCJpYXQiOjE2OTM4Nzg0MDgsImV4cCI6MTY5MzkwNzIwOH0.zYi5728gq_WGIpiMa3wsr86svTHMAdJ_dhKXFpo143M'

http.intercept.request = (options) => {
  // 请求头信息
  options.header = {
    Authorization: token,
    ...options.header,
  }
  return options
}

http.intercept.response = (result) => {
  return result.data
}

// 挂载到全局对象
wx.http = http

export default http
