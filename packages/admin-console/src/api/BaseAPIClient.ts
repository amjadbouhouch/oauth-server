/*
 *
 * Project: winshot-crm
 * File Created: 04 August 2021 16:28
 * Author: Bouhouch Amjed (amjedbouhouch@gmail.com)
 * -----
 * Last Modified: 01 October 2021 09:35
 * -----
 * Copyright 2021
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>
    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>
    patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>
  }
}

/**
 * Global class for fetching && send data with and axios's instance
 *
 */

class BaseAPIClient {
  readonly instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:5000'
    })
    this._initializeResponseInterceptor()
  }

  private _initializeResponseInterceptor() {
    this.instance.interceptors.request.use(this._handleRequest)
    this.instance.interceptors.response.use(this._handleResponse)
  }

  private _handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const jwtToken = localStorage.getItem('token')
    if (config.headers) {
      if (jwtToken) config.headers['Authorization'] = `Bearer ${jwtToken}`
    }

    return config
  }

  private _handleResponse = (response: AxiosResponse) => response.data

  private _handleError = (error: AxiosError) => error
}

export default BaseAPIClient
