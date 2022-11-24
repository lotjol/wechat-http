## wechat-http v0.0.4

微信小程序 wx.request 网络请求的扩展，支持 Promise、拦截器和TypeScript。

## 安装

```bash
npm install wechat-http
```

## 使用说明

```javascript
import http from 'wechat-http'

// 接口基础地址
http.baseURL = 'https://your.host.com'

// 请求拦截器
http.intercept.request = (options) => {
  // 指定默认的头信息
  const defaultHeader: AnyObject = {}
  // 权限认证
  defaultHeader.Authorization = 'Bearer token'
  // 合并头信息
  options.header = Object.assign({}, defaultHeader, options.header)
  // 拦截器处理后的请求参数
  return options
}

// 响应拦截器
http.intercept.response = ({ statusCode, data, config }) => {
  console.log(statusCode) // http 响应状态码
  console.log(config) // 发起请求时的参数
  // 拦截器处理后的响应结果
  return data
}

// 挂载到 wx 全局命名空间
wx.http = http

// 也可作为模块导出
export default http
```

## 快捷方法

```javascript
// GET 方法请求
http.get(url, data?)

// POST 方法请求
http.post(url, data?)

// PUT 方法请求
http.put(url, data?)

// DELETE 方法请求
http.delete(url, data?)
```

## 示例

```javascript
Page({
  async onLoad() {
    await wx.http({url: '/path', methods: 'POST'})
    // 或快捷方法
    await wx.http.get('/path')
  }
})
```

## TypeScript 支持

```javascript
import type { Http } from 'wechat-http'

// 扩展到全局对象 wx 中调用
declare global {
  namespace WechatMiniprogram {
    interface Wx {
      http: Http
    }
  }
}

// 自定义业务接口返回数据的类型
declare module 'wechat-http' {
  export interface ResponseResultData<T = any> {
    code: number
    message: string
    data: T
  }
}
```