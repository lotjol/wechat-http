// 业务接口数据类型
export interface ResponseResultData<T = any> {
  [key: string]: any
  data: T
}

// 数据类型
interface Http {
  <T = ResponseResultData>(options: WechatMiniprogram.RequestOption): Promise<T>
  /**
   * 配置接口基础路径
   */
  baseURL?: string
  /**
   * 请求状态配置，同wx.showLoading
   */
  loading: WechatMiniprogram.ShowLoadingOption
  intercept: {
    request(
      options: WechatMiniprogram.RequestOption
    ): WechatMiniprogram.RequestOption
    response(
      result: WechatMiniprogram.RequestSuccessCallbackResult & {
        config: WechatMiniprogram.RequestOption
      }
    ): any
  }

  // 快捷方法

  /**
   * GET 方法请求
   */
  get<T = any>(
    url: string,
    data?: string | AnyObject
  ): Promise<ResponseResultData<T>>

  /**
   * POST 方法请求
   */
  post<T = any>(
    url: string,
    data?: string | AnyObject
  ): Promise<ResponseResultData<T>>

  /**
   * PUT 方法请求
   */
  put<T = any>(
    url: string,
    data?: string | AnyObject
  ): Promise<ResponseResultData<T>>

  /**
   * DELETE 方法请求
   */
  delete<T = any>(
    url: string,
    data?: string | AnyObject
  ): Promise<ResponseResultData<T>>
}

function createHttp(config = { showLoading: true }) {
  // 记录 loading 的状态
  const loadingQueue: string[] = []

  /**
   * 封装 wx.request API
   */
  const http: Http = (options) => {
    // 处理基础路径
    if (!options.url.startsWith('http') && http.baseURL) {
      options.url = http.baseURL + options.url
    }

    // 调用拦截器处理请求数据
    options = http.intercept.request(options)

    // 记录请求开始的次量
    loadingQueue.push('loading')

    // 是否显示加载 loading
    if (config.showLoading && loadingQueue.length) wx.showLoading(http.loading)

    // 包装 Promise 对象
    return new Promise((resolve, reject) => {
      // 调用小程序 api
      wx.request({
        ...options,
        success: (result) => {
          // 调用拦截器处理响应数据
          resolve(http.intercept.response({ ...result, config: options }))
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

  // get 方法请求
  http.get = (url, data) => {
    return http({ url, data, method: 'GET' })
  }

  // post 方法请求
  http.post = (url, data) => {
    return http({ url, data, method: 'POST' })
  }

  // put 方法请求
  http.put = (url, data) => {
    return http({ url, data, method: 'PUT' })
  }

  // delete 方法请求
  http.delete = (url, data) => {
    return http({ url, data, method: 'DELETE' })
  }

  /**
   * 默认loading配置
   */
  http.loading = {
    title: '正在加载...',
    mask: true,
  }

  /**
   * 默认拦截器（什么也没做）
   */
  http.intercept = {
    request: (options) => options,
    response: (result) => result,
  }

  return http
}

const http = createHttp()

export type { Http }
export { http as default, createHttp }
