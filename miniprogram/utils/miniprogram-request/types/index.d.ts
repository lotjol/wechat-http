interface Http {
  (
    params: WechatMiniprogram.RequestOption,
    options?: { showLoading: boolean }
  ): WechatMiniprogram.RequestTask
  <T>(
    params: WechatMiniprogram.RequestOption,
    options?: { showLoading: boolean }
  ): Promise<T>
  baseURL?: string
  loading: WechatMiniprogram.ShowLoadingOption
  intercept: {
    request(
      result: WechatMiniprogram.RequestOption
    ): WechatMiniprogram.RequestOption
    response(response: WechatMiniprogram.RequestSuccessCallbackResult): any
  }
  // get(url: string, data: any): void;
}
