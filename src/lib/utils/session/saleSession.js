const saleSession = {
    getSaleAllSetup() {
        return JSON.parse(sessionStorage.getItem("saleAllSetup"))
    },

    getAllPaymentMethods() {
        const salesSetup = JSON.parse(sessionStorage.getItem("saleAllSetup"))
        return salesSetup?.paymentMethodSetups
    },

    setSaleAllSetup(data) {
        return sessionStorage.setItem("saleAllSetup", JSON.stringify(data));
    },

    removeSaleAllSetup() {
        sessionStorage.removeItem("saleAllSetup");
    }
}

export default saleSession