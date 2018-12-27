import axios from 'axios'
// import store from '@/store'
import Vue from 'vue'
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (res.data.code && res.data.code !== 200) {
        Vue.prototype.$Message.error(res.data.message)
        return Promise.reject(new Error(res.data.message))
      } else {
        const { data, status } = res
        return { data, status }
      }
    }, error => {
      this.destroy(url)
      // let errorInfo = error.response
      // if (!errorInfo) {
      //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
      //   errorInfo = {
      //     statusText,
      //     status,
      //     request: { responseURL: config.url }
      //   }
      // }
      // addErrorLog(errorInfo)
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '请求错误'
            break

          case 401:
            error.message = '未授权，请登录'
            break

          case 403:
            error.message = '拒绝访问'
            break

          case 404:
            error.message = `请求地址出错: ${error.response.config.url}`
            break

          case 408:
            error.message = '请求超时'
            break

          case 500:
            error.message = '服务器内部错误'
            break

          case 501:
            error.message = '服务未实现'
            break

          case 502:
            error.message = '网关错误'
            break

          case 503:
            error.message = '服务不可用'
            break

          case 504:
            error.message = '网关超时'
            break

          case 505:
            error.message = 'HTTP版本不受支持'
            break

          default:
            error.message = '网络异常'
        }
      } else {
        error.message = '网络异常'
      }
      Vue.prototype.$Message.error(error.message)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
