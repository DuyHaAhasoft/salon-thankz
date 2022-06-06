const clientSession = {
    //client setup
    getClientSetup() {
        return JSON.parse(sessionStorage.getItem("clientSetup"))
    },

    setClientSetup(data) {
        return sessionStorage.setItem("clientSetup", JSON.stringify(data))
    },

    removeClientSetup() {
        sessionStorage.removeItem("clientSetup");
    }
}

export default clientSession