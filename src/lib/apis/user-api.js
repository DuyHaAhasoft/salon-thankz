// Utils
// import axios from 'axios'

import http from './http'
// import constant from "../utils/constant";

// const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const userApis = {
    login(payload) {
        // const url = DEFAULT_API_GATEWAY[env] + '/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US'
        // return axios.post(url, payload, {headers: http.DEFAULT_HEADER})
        const url = '/api/aggr/v1/auth/login/subscriber?culture=en-US&ui-culture=en-US'
        return http.post(url, payload)
    }
}

export default userApis