// Utils
import session from "../utils/session"
import constant from "../utils/constant"

const shopInfo = session.shopSession.getShopInfo()

const http = {
    getHeader(data = {}) {
        return {
            'Authorization': `Bearer ${shopInfo?.userAuthInfo?.authToken}`,
            ...constant.api.DEFAULT_HEADER,
            ...data
        }
    }
}

export default http