// Utils
import axios from 'axios'

import http from './http'
import constant from "../utils/constant";

const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const shopApi = {
    getStaffActive(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/staffs/Staff/Active'
        return axios.post(url, payload, {headers: http.getHeader()})
    },

    getShopInfo(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/clients/Client/ShopInfo'
        return axios.post(url, payload, {headers: http.getHeader()})
    },

    getNextMemberNumber(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/clients/Client/NextMemberNumber'
        return axios.post(url, payload, {headers: http.getHeader()})
    },
}

export default shopApi