// Utils
import axios from 'axios'

import http from './http'
import constant from "../utils/constant";

const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const DEFAULT_HEADER = http.getHeader()

const clientApi = {
    getAllClientByShop(env, payload) {
        const url = DEFAULT_API_GATEWAY[env] + '/api/read/v1/clients/Client/Active'
        return axios.post(url, payload, { headers: DEFAULT_HEADER })
    }
}

export default clientApi