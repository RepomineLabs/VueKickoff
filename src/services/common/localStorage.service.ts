class LocalStorageService {
    constructor() {

    }

    setItem = (key: string, value: any) => {
        if (value) {
            let byteValue = btoa(unescape(encodeURIComponent(value)))
            localStorage.setItem(key, byteValue)
        }
    }

    getItem = (key: string) => {
        const value = localStorage.getItem(key)
        if (value) {
            try {
                return JSON.parse(decodeURIComponent(escape(window.atob(value))))
            } catch (err) {
                return decodeURIComponent(escape(window.atob(value)))
            }
        } else return undefined
    }
}