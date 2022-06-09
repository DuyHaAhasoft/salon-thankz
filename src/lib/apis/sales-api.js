// Utils
import axios from 'axios'

import http from './http'
import constant from "../utils/constant";

const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const salesApis = {
    getPrepaidServiceHistory(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/ClientPrepaidService/ClientPrepaidServiceHistories/Live'
        return axios.post(url, payload, {headers: http.getHeader()})
    },

    getPrepaidCardHistory(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/ClientPrepaidCard/ClientPrepaidCardHistories/Live'
        return axios.post(url, payload, {headers: http.getHeader()})
    },

    getSalesDetail(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/sales/Sales/Sales/Live'
        return axios.post(url, payload, {headers: http.getHeader()})
    }
}

export default salesApis