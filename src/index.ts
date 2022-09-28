// 封装小程序网络请求 api

interface Http {
  <T>(
    params: WechatMiniprogram.RequestOption,
    options?: { showLoading: boolean }
  ): Promise<T>
  /**
   * 配置接口基础路径
   * @type {string}
   */
  baseURL?: string
  /**
   * 请求状态配置，同wx.showLoading
   */
  loading: WechatMiniprogram.ShowLoadingOption
  intercept: {
    request(
      result: WechatMiniprogram.RequestOption
    ): WechatMiniprogram.RequestOption
    response(response: WechatMiniprogram.RequestSuccessCallbackResult): any
  }
  get<T>(url: string, data?: any): Promise<T>
  post<T>(url: string, data?: any): Promise<T>
}

// 记录 loading 的状态
const loadingQueue: string[] = []

const http: Http = <T>(
  params: WechatMiniprogram.RequestOption,
  options = { showLoading: true }
): Promise<T> => {
  // 处理基础路径
  if (!params.url.startsWith('http') && http.baseURL) {
    params.url = http.baseURL + params.url
  }

  // 调用拦截器处理请求数据
  params = http.intercept.request(params)

  // 记录请求开始的次量
  loadingQueue.push('loading')

  // 是否显示加载 loading
  if (options.showLoading && loadingQueue.length) wx.showLoading(http.loading)

  // 包装 Promise 对象
  return new Promise((resolve, reject) => {
    // 调用小程序 api
    wx.request({
      ...params,
      success: (result) => {
        // 调用拦截器处理响应数据
        resolve(http.intercept.response(result))
      },
      fail: reject,
      complete: () => {
        // 记录结束的请求数量
        loadingQueue.pop()

        // 关闭加载提示框
        if (!loadingQueue.length) wx.hideLoading()
      },
    })
  })
}

// 基础路径
// http.baseURL = 'https://yapi.itheima.net/mock/30'

http.loading = {
  title: '正在加载...',
  mask: true,
}

// 默认拦截器（什么都没做）
http.intercept = {
  request: (params: any) => params,
  response: (result: any) => result,
}

http.get = <T>(url: string, data?: any) => {
  return http<T>({
    url,
    data,
    method: 'GET',
  })
}

http.post = <T>(url: string, data?: any) => {
  return http<T>({
    url,
    data,
    method: 'POST',
  })
}

export default http
