import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import ListSkuPage from '@/pages/sku/list'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/skus',
      name: 'ListSku',
      component: ListSkuPage
    }
  ]
})
