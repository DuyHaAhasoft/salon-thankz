import Vue from 'vue'
import App from './App.vue'

//import Bootstrap
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

//import router
import router from './route';

//import v-calendar
import VCalendar from "v-calendar";

//use Bootstrap
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

//use v-calendar
Vue.use(VCalendar, {
  componentPrefix: 'v',
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
