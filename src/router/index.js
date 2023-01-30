import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import reg from '../views/reg.vue'
import home from '../views/home.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/reg',
    name: 'reg',
    component: reg
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
