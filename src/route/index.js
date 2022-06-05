import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../pages/Home/Home.vue'
import Login from '../pages/Login/Login.vue';
import Client from '../pages/Client/Client.vue';

Vue.use(VueRouter);

// custom vue router with double click
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const routes = [
    {path: '/', name: 'home' , component: Home},
    {path: '/login', name: 'login', component: Login},
    {path: '/client', name: 'client' , component: Client},
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && sessionStorage.getItem("shopInfo") === null) {
    next({name: 'login'})
  }
  else {
    next()
  }
})

export default router;