import Vue from 'vue'
import App from './App.vue'

//import Vue Router & routes
import VueRouter from 'vue-router';
import routes from './route';

//use Vue Router
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes,
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
