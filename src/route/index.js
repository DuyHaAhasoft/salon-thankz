import Login from '../pages/Login/Login.vue';
import Client from '../pages/Client/Client.vue';
import Home from '../pages/Home/Home.vue'

const routes = [
    {path: '/', name: 'home' , component: Home},
    {path: '/login', name: 'login', component: Login},
    {path: '/client', name: 'client' , component: Client},
]
export default routes;