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

    removeItem = (key: string) => {
        localStorage.removeItem(key)
    }

    removeItems = (keys: string[]) => {
        for (let i = 0; i < keys.length; i++) {
            localStorage.removeItem(keys[i])
        }
    }

    clear = () => {
        localStorage.clear()
    }
}

export default new LocalStorageService()