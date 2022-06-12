// Utils
// import axios from 'axios'

import http from './http'
// import constant from "../utils/constant";

// const DEFAULT_API_GATEWAY = constant.api.DEFAULT_API_GATEWAY

const shopApi = {
    getStaffActive(payload) {
        const url = '/api/read/v1/staffs/Staff/Active'
        return http.post(url, payload)
    },

    getShopInfo(payload) {
        const url = '/api/read/v1/clients/Client/ShopInfo'
        return http.post(url, payload)
    },

    getNextMemberNumber(payload) {
        const url = '/api/read/v1/clients/Client/NextMemberNumber'
        return http.post(url, payload)
    },

    getSalesSetUp(payload) {
        const url = '/api/read/v1/sales/SalesSetup/AllSalesSetups/Live'
        return http.post(url, payload)
    }
}

export default shopApi