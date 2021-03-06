const api = {
    DEFAULT_API_GATEWAY: {
        LOCAL: 'https://localhost:44001',
        DEV: 'https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net',
        PRODUCTION: 'https://ahasoft-salon-admin-http-aggregator.azurewebsites.net',
        STAGING: 'https://ahasoft-salon-admin-http-aggregator-staging.azurewebsites.net',
    },

    SOLUTION_ID: {
        SALON_ADMIN: 3002
    },

    DEFAULT_HEADER: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
        'Accept': 'application/json'
    },

    DEFAULT_URL_IMAGE: {
        CLIENT: 'https://ahasoftsaloncommondev.blob.core.windows.net/clients'
    }
}

export default api