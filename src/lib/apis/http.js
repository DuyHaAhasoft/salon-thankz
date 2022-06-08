// Utils
import session from "../utils/session"
import constant from "../utils/constant"

const http = {
    /**
     * sao deo xai axios.interceptors
     */

    getHeader(data = {}) {
        const shopInfo = session.shopSession.getShopInfo()
        return {
            'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`, // Non
            ...constant.api.DEFAULT_HEADER,
            ...data
        }
    }
}

export default http