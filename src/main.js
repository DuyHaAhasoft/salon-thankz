import Vue from 'vue'
import App from './App.vue'

//import Bootstrap
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

//import Vue Router & routes
import VueRouter from 'vue-router';
import routes from './route';

//use Bootstrap
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

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
