// 业务接口数据类型
export interface ResponseResultData<T = any> {
  [key: string]: any
  data: T
}

type Method = WechatMiniprogram.RequestOption['method'] | 'UPLOAD'
type Options =
  | WechatMiniprogram.RequestOption
  | (WechatMiniprogram.UploadFileOption & { method: Method })
type RequestData = WechatMiniprogram.RequestOption['data']
type RequestConfig = Omit<
  WechatMiniprogram.RequestOption,
  'url' | 'method' | 'data' | 'success' | 'fail' | 'complete'
>
type UploadData = Pick<
  WechatMiniprogram.UploadFileOption,
  'name' | 'filePath' | 'formData'
>
type UploadConfig = Omit<
  WechatMiniprogram.UploadFileOption,
  'url' | 'name' | 'filePath' | 'formData' | 'success' | 'fail' | 'complete'
>

// 数据类型
interface Http {
  <T = ResponseResultData>(options: Options): Promise<T>
  /**
   * 配置接口基础路径
   */
  baseURL?: string
  /**
   * 请求状态配置，同wx.showLoading
   */
  loading: WechatMiniprogram.ShowLoadingOption
  intercept: {
    request(options: Options): Options
    response(
      result:
        | (WechatMiniprogram.RequestSuccessCallbackResult & {
            config: Options
          })
        | (WechatMiniprogram.UploadFileSuccessCallbackResult & {
            config: Options
          })
    ): any
  }

  // 快捷方法

  /**
   * GET 方法请求
   */
  get<T = any>(
    url: string,
    data?: RequestData,
    config?: RequestConfig
  ): Promise<ResponseResultData<T>>

  /**
   * POST 方法请求
   */
  post<T = any>(
    url: string,
    data?: RequestData,
    config?: RequestConfig
  ): Promise<ResponseResultData<T>>

  /**
   * PUT 方法请求
   */
  put<T = any>(
    url: string,
    data?: RequestData,
    config?: RequestConfig
  ): Promise<ResponseResultData<T>>

  /**
   * DELETE 方法请求
   */
  delete<T = any>(
    url: string,
    data?: RequestData,
    config?: RequestConfig
  ): Promise<ResponseResultData<T>>

  /**
   * wx.uploadFile 上传文件
   */
  upload<T = any>(
    url: string,
    data: UploadData,
    config?: UploadConfig
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
      // 去除 baseURL 最后的 /
      if (http.baseURL.endsWith('/')) {
        http.baseURL = http.baseURL.slice(0, -1)
      }
      // 拼接 baseURL
      options.url = http.baseURL + options.url
    }

    // 调用拦截器处理请求数据
    options = http.intercept.request(options)

    // 记录请求开始的次量
    loadingQueue.push('loading')

    // 是否显示加载 loading
    if (config.showLoading && loadingQueue.length) {
      wx.showLoading(http.loading)
    }

    // 非上传文件请求
    if (options.method === 'UPLOAD') {
      // 包装 Promise 对象
      return new Promise((resolve, reject) => {
        // 联合类型断言
        const _options = options as WechatMiniprogram.UploadFileOption
        // 调用 wx.uploadFile 上传文件
        wx.uploadFile({
          ..._options,
          success: (result) => {
            // 将响应数据转为对象
            result.data = JSON.parse(result.data)
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
    } else {
      // 包装 Promise 对象
      return new Promise((resolve, reject) => {
        // 联合类型断言
        const _options = options as WechatMiniprogram.RequestOption
        // 调用 wx.request 发送请求
        wx.request({
          ..._options,
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
  }

  // get 方法请求
  http.get = (url, data, config) => {
    return http({ method: 'GET', url, data, ...config })
  }

  // post 方法请求
  http.post = (url, data, config) => {
    return http({ method: 'POST', url, data, ...config })
  }

  // put 方法请求
  http.put = (url, data, config) => {
    return http({ method: 'PUT', url, data, ...config })
  }

  // delete 方法请求
  http.delete = (url, data, config) => {
    return http({ method: 'DELETE', url, data, ...config })
  }

  // upload 方法请求
  http.upload = (url, data, config) => {
    return http({ method: 'UPLOAD', url, ...data, ...config })
  }

  /**
   * 默认loading配置
   */
  http.loading = {
    title: '正在加载',
    mask: false,
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
