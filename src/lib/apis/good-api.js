import http from './http'

const goodApis = {
    getServiceCategory(payload) {
        const url = '/api/read/v1/goods/ServiceCategory'
        return http.post(url, payload)
    },

    getServiceByCategory(payload) {
        const url = '/api/read/v1/goods/Service'
        return http.post(url, payload)
    },

    getProductCategory(payload) {
        const url = '/api/read/v1/goods/ProductCategory'
        return http.post(url, payload)
    },

    getProductByCategory(payload) {
        const url = '/api/read/v1/inventory/Product'
        return http.post(url, payload)
    },

    getPrepaidCard(payload) {
        const url = '/api/read/v1/goods/PrepaidCard'
        return http.post(url, payload)
    },

    getPrepaidServiceByCategory(payload) {
        const url = '/api/read/v1/goods/PrepaidService'
        return http.post(url, payload)
    },
}

export default goodApis