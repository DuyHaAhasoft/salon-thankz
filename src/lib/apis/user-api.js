// Utils
import axios from 'axios'

import http from './http'
import constant from "../utils/constant";

const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const DEFAULT_HEADER = http.getHeader()

const userApi = {
    login(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US'
        return axios.post(url, payload, DEFAULT_HEADER)
    }
}

export default userApi