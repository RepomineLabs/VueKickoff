class LocalStorageService {
    constructor() {

    }

    setItem = (key: string, value: any) => {
        if (value) {
            let byteValue = btoa(unescape(encodeURIComponent(value)))
            localStorage.setItem(key, byteValue)
        }
    }
}