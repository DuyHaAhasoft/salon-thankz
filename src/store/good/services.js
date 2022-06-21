import { assign } from "lodash";

const INITIAL_SERVICES = {
    categoryService: {},
    listCategoryService: [],

    service: {},
    listService: [],
}
const state = Object.assign({}, INITIAL_SERVICES)

const getters = {
    getCategoryService: state => {
        return state.categoryService
    },

    getListCategoryService: state => {
        return state.listCategoryService
    },


    getService: state => {
        return state.Service;
    },

    getListService: state => {
        return state.listService
    }
}

const mutations = {
    handleSetCategoryService(state, category) {
        state.Service = Object.assign(state.categoryService, category);
    },

    handleSetListCategoryService(state, listCategory) {
        state.listService = assign(state.listCategoryService, listCategory)
    },

    handleSetService(state, Service) {
        state.Service = Object.assign(state.Service, Service);
    },

    handleSetListService(state, listService) {
        state.listService = assign(state.listService, listService)
    },
}

const actions = {
    handleSetCategoryService({commit}, category) {
        commit('handleSetCategoryService', category);
    },

    handleSetListCategoryService({commit}, listCategory) {
        commit('handleSetListCategoryService', listCategory)
    },

    handleSetService({commit}, Service) {
        commit('handleSetService', Service);
    },

    handleSetListService({commit}, listService) {
        commit('handleSetService', listService)
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}