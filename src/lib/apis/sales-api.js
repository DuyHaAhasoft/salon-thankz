// Utils
import http from './http'

const salesApis = {
    getPrepaidServiceHistory(payload) {
        const url = '/api/read/v1/sales/ClientPrepaidService/ClientPrepaidServiceHistories/Live'
        return http.post(url, payload)
    },

    getPrepaidCardHistory(payload) {
        const url = '/api/read/v1/sales/ClientPrepaidCard/ClientPrepaidCardHistories/Live'
        return http.post(url, payload)
    },

    getSalesDetail(payload) {
        const url = '/api/read/v1/sales/Sales/Sales/Live'
        return http.post(url, payload)
    },

    addSales(payload) {
        const url = '/api/cmd/v1/sales/Sales'
        return http.post(url, payload)
    },

    getAllSalesSetup(payload) {
        const url = '/api/read/v1/sales/SalesSetup/AllSalesSetups/Live'
        return http.post(url, payload)
    }
}

export default salesApis