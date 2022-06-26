const shopSession = {
    getShopId() {
        const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return shopInfo?.shopBasicInfo?.shopId
    },

    getChainId() {
        const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return shopInfo?.shopBasicInfo?.chainInfo?.chainId
    },

    getBranchInfo() {
        const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return {
            type: shopInfo?.shopBasicInfo?.chainInfo?.branchType,
            number: shopInfo?.shopBasicInfo?.chainInfo?.branchNumber,
        }
    },

    getSessionToken() {
        const shopInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return shopInfo?.userAuthInfo?.session_token
    },

    getUserAccount() {
        const userInfo = JSON.parse(sessionStorage.getItem("shopInfo"))
        return {
            name: userInfo?.userAuthInfo?.name ?? '',
            id: userInfo?.userAuthInfo?.userAccountId ?? 0,
        }
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