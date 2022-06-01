const shopSession = {
    getShopId() {
        const shopInfo = this.getShopInfo()
        return shopInfo.shopBasicInfo.shopId
    },
    getShopInfo() {
        return JSON.parse(sessionStorage.getItem("shopInfo"))
    },
    setShopInfo(data) {
        return sessionStorage.setItem("shopInfo", JSON.stringify(data));
    },
    removeShopInfo() {
        sessionStorage.removeItem("shopInfo");
    }
}

export default shopSession