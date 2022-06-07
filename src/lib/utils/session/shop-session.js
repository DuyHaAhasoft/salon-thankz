const shopSession = {
    getShopId() {
        const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return shopInfo?.shopBasicInfo?.shopId
    },

    getSessionToken() {
        const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return shopInfo?.userAuthInfo?.session_token
    },

    // ShopInfo
    getShopInfo() {
        return JSON.parse(sessionStorage.getItem("shopInfo"))
    },

    setShopInfo(data) {
        return sessionStorage.setItem("shopInfo", JSON.stringify(data));
    },

    removeShopInfo() {
        sessionStorage.removeItem("shopInfo");
    },

    //Staff
    getStaffActive() {
        return JSON.parse(sessionStorage.getItem("staffActive"))
    },

    setStaffActive(data) {
        return sessionStorage.setItem("staffActive", JSON.stringify(data));
    },

    removeStaffActive() {
        sessionStorage.removeItem("staffActive");
    }
}

export default shopSession