const INITIAL_PRODUCTS = {
    //category product
    categoryProduct: {},
    listCategoryProduct: [],

    //product
    product: {},
    listProduct: [],
}
const state = Object.assign({}, INITIAL_PRODUCTS)

const getters = {
    getCategoryProduct: state => {
        return state.categoryProduct
    },

    getListCategoryProduct: state => {
        return state.listCategoryProduct
    },


    getProduct: state => {
        return state.product;
    },

    getListProduct: state => {
        return state.listProduct
    }
}

const mutations = {
    handleSetCategoryProduct(state, category) {
        state.product = Object.assign(state.categoryProduct, category);
    },

    handleSetListCategoryProduct(state, listCategory) {
        state.listProduct = Object.assign(state.listCategoryProduct, listCategory)
    },

    handleSetProduct(state, product) {
        state.product = Object.assign(state.product, product);
    },

    handleSetListProduct(state, listProduct) {
        state.listProduct = Object.assign(state.listProduct, listProduct)
    },
}

const actions = {
    handleSetCategoryProduct({commit}, category) {
        commit('handleSetCategoryProduct', category);
    },

    handleSetListCategoryProduct({commit}, listCategory) {
        commit('handleSetListCategoryProduct', listCategory)
    },

    handleSetProduct({commit}, product) {
        commit('handleSetProduct', product);
    },

    handleSetListProduct({commit}, listProduct) {
        commit('handleSetProduct', listProduct)
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}