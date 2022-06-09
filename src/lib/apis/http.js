// Utils

import axios from 'axios';
import session from "../utils/session"
import constant from "../utils/constant"

// const http = {
//     /**
//      * sao deo xai axios.interceptors
//      */

//     getHeader(data = {}) {
//         const shopInfo = session.shopSession.getShopInfo()
//         return {
//             'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`, // Non
//             ...constant.api.DEFAULT_HEADER,
//             ...data
//         }
//     }
// }

const http = axios.create({
    baseURL: constant.api.DEFAULT_API_GATEWAY.DEV
}
)

http.interceptors.request.use(function (config) {
    const shopInfo = session.shopSession.getShopInfo()

    config.headers = {
        'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`,
        ...constant.api.DEFAULT_HEADER
    }

    return config;
})

export default http