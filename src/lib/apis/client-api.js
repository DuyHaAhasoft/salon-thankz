// Utils
// import axios from 'axios'

import http from './http'
// import constant from "../utils/constant";

// const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const clientApis = {
    getAllClientByShop(payload) {
        // const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/clients/Client/Active'
        // return axios.post(url, payload, { headers: http.getHeader() })
        const url = '/api/read/v1/clients/Client/Active'
        return http.post(url, payload)
    },

    createNewClient(payload) {
        const url = '/api/aggr/v1/Client/CreateClient'
        return http.post(url, payload)
    },

    editClient(payload) {
        const url = '/api/aggr/v1/Client/EditClient'
        return http.put(url, payload)
    },

    deleteClient(payload) {
        const url = '/api/aggr/v1/Client/UpdateClientToDeleted'
        return http.post(url, payload)
    },

    getNextMemberNumber(payload) {
        const url = '/api/read/v1/clients/Client/NextMemberNumber'
        return http.post(url, payload)
    },

    getClientByClientId(payload) {
        const url = '/api/aggr/v1/Client/GetClient'
        return http.post(url, payload)
    },

    getClientAccount(payload) {
        const url = 'api/read/v1/sales/ClientAccount/ClientAccounts/Live'
        return http.post(url, payload)
    },

    uploadClientImage(payload) {
        const url = '/api/cmd/v1/clients/ClientImage'
        return http.post(url, payload)
    },

    deleteClientImage(data) {
        const url = '/api/cmd/v1/clients/ClientImage'
        return http.delete(url, { data: data })
    },

    getClientPrepaidServices(payload) {
        const url = '/api/read/v1/sales/ClientPrepaidService/ClientPrepaidServices/Live'
        return http.post(url, payload)
    },

    getClientPrepaidCards(payload) {
        const url = '/api/read/v1/sales/ClientPrepaidCard/ClientPrepaidCards/Live'
        return http.post(url, payload)
    },

    getTotalValidPrepaidGoods(payload) {
        const url = '/api/read/v1/sales/SalesSetup/PriorityPrepaidGoodsDisplay/Live'
        return http.post(url, payload)
    },

    getClientWithSales(payload) {
        const url = '/api/read/v1/sales/ClientAccount/ClientAccounts/Live'
        return http.post(url, payload)
    },

    getSalesHistoryByClient(payload) {
        const url = 'api/read/v1/sales/Sales/SalesHistoriesByClient/Live'
        return http.post(url, payload)
    },
}

export default clientApis