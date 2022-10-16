import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CancelToken } from 'axios'

abstract class Api {
    instance: AxiosInstance

    constructor(baseURL: string) {
        // Create axios instance
        this.instance = axios.create({
            baseURL,
        })
    }
}