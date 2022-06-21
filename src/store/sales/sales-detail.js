

const INITIAL_SALES_DETAIL = {
    balanceDeduction: 0,
	balanceMoves: [],
	bookingId: 0,
	branchNumber: 1,
	chainId: 0,
	clientId: 0,
	createdById: 0,
	createdByName: "",
	createdDateTimeTS: 0,
	deductionPoints: 0,
	deletedById: 0,
	deletedByName: "",
	deletedDateTimeTS: 0,
	earnedPoints: 0,
	editedById: 0,
	editedByName: "",
	editedDateTimeTS: 0,
	editedSalesId: 0,
	hourOfDay: 0,
	invoiceDateTimeTS: 0,
	isSalesConnect: false,
	notes: "",
	outstanding: 0,
	payments: [],
	salesId: 0,
	salesItems: [],
	salesNumber: "",
	sessionToken: null,
	shopId: 0,
	shopLocation: "vi-vn",
	status: 0,
	totalAmount: 0,
}

const state = Object.assign({}, INITIAL_SALES_DETAIL)

const getters = {
    getSalesDetail: state => {
        return state
    },
}

const mutations = {
    handleSalesDetail(state, salesDetail) {
        state.Service = Object.assign(state, salesDetail);
    },
}

const actions = {
    handleSalesDetail({commit}, salesDetail) {
        commit('handleSalesDetail', salesDetail);
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}