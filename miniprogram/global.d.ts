import http from '@botue/wechat-http'

declare global {
  namespace WechatMiniprogram {
    interface Wx {
      http: typeof http
    }
  }
}
