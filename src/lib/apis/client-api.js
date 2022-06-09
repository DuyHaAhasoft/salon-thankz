// Utils
// import axios from 'axios'

import http from './http'
// import constant from "../utils/constant";

// const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const clientApi = {
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

    getNextMemberNumber(payload) {
        const url = '/api/read/v1/clients/Client/NextMemberNumber'
        return http.post(url, payload)
    },

    getClientByClientId(payload) {
        const url = '/api/aggr/v1/Client/GetClient'
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
}

export default clientApi