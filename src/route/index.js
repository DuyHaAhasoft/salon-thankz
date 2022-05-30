import Login from '../pages/Login/Login.vue';
import Client from '../pages/Client/Client.vue';

const routes = [
    {path: '/client', name: 'client' , component: Client},
    {path: '/', name: 'login' , component: Login},
]
export default routes;