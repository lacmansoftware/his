import { service } from '@/config/axios'

import { AxiosPromise } from 'axios'

import { config } from '@/config/axios/config'

const { default_headers } = config

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headersType, responseType } = option
  return service({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      // 'Access-Control-Allow-Origin': 'http://192.168.108.87:4000',
      // 'Access-Control-Allow-Credentials': 'true',
      'Content-Type': headersType || default_headers
    }
  })
}

function getFn<T = any>(option: AxiosConfig): AxiosPromise<T> {
  return request({ method: 'get', ...option })
}

function postFn<T = any>(option: AxiosConfig): AxiosPromise<T> {
  return request({ method: 'post', ...option })
}

function deleteFn<T = any>(option: AxiosConfig): AxiosPromise<T> {
  return request({ method: 'delete', ...option })
}

function putFn<T = any>(option: AxiosConfig): AxiosPromise<T> {
  return request({ method: 'put', ...option })
}

export const useAxios = () => {
  return {
    get: getFn,
    post: postFn,
    delete: deleteFn,
    put: putFn
  }
}
