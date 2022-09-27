"use strict";
// 封装小程序网络请求 api
Object.defineProperty(exports, "__esModule", { value: true });
// 记录 loading 的状态
const loadingQueue = [];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const http = (params, options = { showLoading: true }) => {
    // 处理基础路径
    if (!params.url.startsWith('http') && http.baseURL) {
        params.url = http.baseURL + params.url;
    }
    // 调用拦截器处理请求数据
    params = http.intercept.request(params);
    // 记录请求开始的次量
    loadingQueue.push('loading');
    // 是否显示加载 loading
    if (options.showLoading && loadingQueue.length)
        wx.showLoading(http.loading);
    // 是否为 callback 模式
    const isCallbackMode = params.success || params.fail || params.complete;
    if (isCallbackMode) {
        // 调用小程序 api
        return wx.request(Object.assign(Object.assign({}, params), { success: (result) => {
                // 处理请求成功的逻辑
                if (params.success) {
                    params.success(http.intercept.response(result));
                }
            }, fail: params.fail, complete: (result) => {
                // 处理响应完成的逻辑
                if (params.complete)
                    params.complete(result);
                // 记录结束的请求数量
                loadingQueue.pop();
                // 关闭加载提示框
                if (!loadingQueue.length)
                    wx.hideLoading();
            } }));
    }
    // 包装 Promise 对象
    return new Promise((resolve, reject) => {
        // 调用小程序 api
        wx.request(Object.assign(Object.assign({}, params), { success: (result) => {
                // 调用拦截器处理响应数据
                resolve(http.intercept.response(result));
            }, fail: reject, complete: () => {
                // 记录结束的请求数量
                loadingQueue.pop();
                // 关闭加载提示框
                if (!loadingQueue.length)
                    wx.hideLoading();
            } }));
    });
};
// 基础路径
// http.baseURL = 'https://yapi.itheima.net/mock/30'
http.loading = {
    title: '正在加载...',
    mask: true,
};
// 默认拦截器（什么都没做）
http.intercept = {
    request: (params) => params,
    response: (result) => result,
};
// http.get = (url, data) => {};
exports.default = http;
