import Vue from 'vue';
import Vuex from 'vuex';
import products from './good/products';
import services from './good/services';
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        services,
        products
    }
  })