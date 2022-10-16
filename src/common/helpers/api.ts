import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CancelToken, type AxiosError } from 'axios'
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

        // Activate response interceptor
        this._initRespInterceptor()
    }

    // Request Interceptor
    _initReqInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleReq,
            this._handleReqError,
        )
    }

    // Response Interceptor
    _initRespInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResp,
            this._handleRespError,
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

    // Calling in the interceptor > response.use
    _handleResp = (response: AxiosResponse) => {
        if (response && response.data && !response.data.IsSucceed && response.data.ErrorCode) {
            return Promise.reject(response.data.ErrorCode)
        } else {
            return Promise.resolve(response)
        }
    }

    // Calling in the interceptor > response.use
    // Debug error and starts the refresh token process if necessary.
    _handleRespError = (error: any) => {
        const config = error.config
        if (config && config.url !== "Login" && error.response) {
            if (error.response?.status === 401 && !config._retry) {
                config._retry = true;
                return new Promise((resolve, reject) => {
                    const AccessToken = LocalStorageService.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
                    const RefreshToken = LocalStorageService.getItem(LOCAL_STORAGE_REFRESH_TOKEN)
                    this.instance.post('RefreshAccessToken', { RefreshToken, AccessToken })
                        .then((response: any) => {
                            if (response.data.IsSucceed) {
                                // 1) Store Auth to State

                                // 2) Change Content-Type header
                                if (config.headers) {
                                    config.headers['Authorization'] = `Bearer ${LocalStorageService.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`
                                }

                                // 3) Return request object with axios
                                this.instance(config).then(_response => {
                                    resolve(_response);
                                }).catch((err) => {
                                    reject(err);
                                })
                            } else {
                                // store.dispatch('auth/logout').then(() => {
                                //     router.push('/auth/login')
                                // })
                            }
                        })
                        .catch(_error => {
                            // store.dispatch('auth/logout').then(() => {
                            //     router.push('/auth/login')
                            // })
                            return Promise.reject(_error)
                        })
                });

            } else if (error.response.status === 401) {
                // store.dispatch('auth/logout').then(() => {
                //     router.push('/auth/login')
                // })
                return Promise.reject(error)
            } else {
                return Promise.reject(error)
            }
        }
    }
}