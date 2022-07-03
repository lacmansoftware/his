const config: {
  base_url: {
    base: string
    dev: string
    pro: string
    test: string
  }
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * api请求基础路径
   */
  base_url: {
    // 开发环境接口前缀
    // base: 'http://192.168.108.87:8080/http://35.194.244.237:9998/',
    // base: 'http://cors-everywhere.herokuapp.com/http://35.194.244.237:9998/',
    // base: 'http://35.194.244.237:9998/',
    base: 'api',

    // 打包开发环境接口前缀
    dev: 'api',

    // 打包生产环境接口前缀
    pro: 'api',

    // 打包测试环境接口前缀
    test: 'api'
  },

  /**
   * 接口成功返回状态码
   */
  result_code: 0,

  /**
   * 接口请求超时时间
   */
  request_timeout: 60000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json'
}

export { config }
