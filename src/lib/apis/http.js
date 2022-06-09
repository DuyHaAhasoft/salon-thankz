// Utils
import session from "../utils/session"
import constant from "../utils/constant"
import axios  from "axios"

const http = {

    getHeader(data = {}) {
        const shopInfo = session.shopSession.getShopInfo()

        // return {
        //     'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`,
        //     ...constant.api.DEFAULT_HEADER,
        //     ...data
        // }
        
        axios.interceptors.request.use((config) => {

            config.headers = {
                'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`,
                ...constant.api.DEFAULT_HEADER,
                ...data
            }

            console.log(config)

            return config
        }, 
        errors => {
            return Promise.reject(errors);
        })
    }
}

export default http