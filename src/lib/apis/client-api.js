// Utils
import axios from 'axios'

import http from './http'
import constant from "../utils/constant";

const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const clientApis = {
    getAllClientByShop(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/clients/Client/Active'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    createNewClient(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/aggr/v1/Client/CreateClient'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    editClient(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/aggr/v1/Client/EditClient'
        return axios.put(url, payload, { headers: http.getHeader() })
    },

    getNextMemberNumber(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/clients/Client/NextMemberNumber'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    getClientByClientId(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/aggr/v1/Client/GetClient'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    uploadClientImage(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/cmd/v1/clients/ClientImage'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    deleteClientImage(env, data) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/cmd/v1/clients/ClientImage'
        return axios.delete(url, { headers: http.getHeader(), data: data })
    },

    getClientPrepaidServices(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/ClientPrepaidService/ClientPrepaidServices/Live'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    getClientPrepaidCards(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/ClientPrepaidCard/ClientPrepaidCards/Live'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    getTotalValidPrepaidGoods(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/SalesSetup/PriorityPrepaidGoodsDisplay/Live'
        return axios.post(url, payload, { headers: http.getHeader() })
    },

    getClientWithSales(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/ClientAccount/ClientAccounts/Live'
        return axios.post(url, payload, { headers: http.getHeader() })
    },
}

export default clientApis