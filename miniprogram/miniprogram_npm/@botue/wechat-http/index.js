module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1664349273432, function(require, module, exports) {

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
// http.get = (url, data) => {}
exports.default = http;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1664349273432);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map