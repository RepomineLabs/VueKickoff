import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CancelToken } from 'axios'
import LocalStorageService from '../services/localStorage.service'

const LOCAL_STORAGE_ACCESS_TOKEN = 'AccessToken'
const LOCAL_STORAGE_REFRESH_TOKEN = 'RefreshToken'

abstract class Api {
    instance: AxiosInstance

    constructor(baseURL: string) {
        // Create axios instance
        this.instance = axios.create({
            baseURL,
        })

        // Activate request interceptor
        this._initReqInterceptor()
    }

    // Request Interceptor
    _initReqInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleReq,
            this._handleReqError,
        )
    }

    // Calling in the interceptor > request.use
    _handleReq = (config: AxiosRequestConfig): AxiosRequestConfig => {
        if (config && config.headers) {
            config.headers['Authorization'] = 'Bearer ' + LocalStorageService.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        }
        return config
    }

    // Calling in the interceptor > request.use
    _handleReqError = (error: Error) => Promise.reject(error)
}