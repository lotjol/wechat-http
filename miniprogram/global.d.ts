import { Http } from 'wechat-http'

declare global {
  namespace WechatMiniprogram {
    interface Wx {
      http: Http
    }
  }
}

declare module 'wechat-http' {
  export interface ResponseResultData<T> {
    code: number
    message: string
    data: T
  }
}
