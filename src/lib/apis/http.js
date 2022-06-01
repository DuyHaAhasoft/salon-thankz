// Utils
import session from "../utils/session"
import constant from "../utils/constant"

const http = {
    getHeader(data = {}) {
        const shopInfo = session.shopSession.getShopInfo()
        return {
            'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`,
            ...constant.api.DEFAULT_HEADER,
            ...data
        }
    }
}

export default http