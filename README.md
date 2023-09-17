## wechat-http v0.0.8

微信小程序 [wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html) 和 [wx.uploadFile](https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html) 请求的扩展，支持 Promise、拦截器和 TypeScript。

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
  // 合并头信息
  options.header = {
    // 权限认证
    Authorization: 'Bearer token'
    // 默认头信息
    ...options.header
  }
  // 拦截器处理后的请求参数
  return options
}

// 响应拦截器
http.intercept.response = (result) => {
  console.log(result.statusCode) // http 响应状态码
  console.log(result.config) // 发起请求时的参数
  // 拦截器处理后的响应结果
  return result.data
}

// 作为模块导出
export default http

// 也可挂载到 wx 全局命名空间
wx.http = http
```

## 快捷方法

```javascript
// GET 方法请求
http.get(url, data?, config?)

// POST 方法请求
http.post(url, data?, config?)

// PUT 方法请求
http.put(url, data?, config?)

// DELETE 方法请求
http.delete(url, data?, config?)

// 调用 wx.uploadFile 上传文件
http.upload(url, data?, config?)
```

## 示例

```javascript
Page({
  async onLoad() {
    // request 网络请求 - 普通用法
    await wx.http({ url: '/path', method: 'POST' })
    // 或快捷方法
    await wx.http.get('/path')


    // 选择文件
    const { tempFiles } = await wx.chooseMedia({ count: 1 })
    // uploadFile 上传文件 - 普通用法
    await wx.http({
      url: '/path',
      method: 'UPLOAD', // 调用 wx.uploadFile
      name: 'file', // 文件的 key , 服务器端通过 key 获取文件二进制内容
      filePath: tempFiles[0].tempFilePath, // 文件的 value , 要上传文件资源的路径(本地路径)
      formData: {}, // HTTP 请求中其他额外的 form data
    })
    // 或快捷方法
    await wx.http.upload('/path', {
      name: 'file', // 文件的 key
      filePath: tempFiles[0]tempFilePath, // 文件的 value
      formData: {}, // // HTTP 请求中其他额外的 form data
    })
  },
})
```

## TypeScript 支持

```javascript
// global.d.ts
import type { Http } from 'wechat-http'

// 扩展到全局对象 wx 中调用
declare global {
  namespace WechatMiniprogram {
    interface Wx {
      http: Http
    }
  }
}

// 返回数据的类型 - <用户自定义业务接口类型>
declare module 'wechat-http' {
  export interface ResponseResultData<T = any> {
    code: number
    message: string
    data: T
  }
}
```
