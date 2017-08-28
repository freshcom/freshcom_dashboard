import Vue from 'vue'
import Router from 'vue-router'

import qs from 'qs'

import { DEFAULT_PAGE_SIZE } from '@/env'

import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import ListSkuPage from '@/pages/sku/list'
import ShowSkuPage from '@/pages/sku/show'
import EditSkuPage from '@/pages/sku/edit'
import NewSkuPage from '@/pages/sku/new'

Vue.use(Router)

function extractPagination (route) {
  let queryString = route.fullPath.split('?')[1]
  let query = qs.parse(queryString)

  let pageNumber = 1
  let pageSize = DEFAULT_PAGE_SIZE
  if (query.page && query.page.number) {
    pageNumber = query.page.number
  }
  if (query.page && query.page.size) {
    pageSize = query.page.size
  }

  return { number: parseInt(pageNumber), size: parseInt(pageSize) }
}

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
      component: ListSkuPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/skus/new',
      name: 'NewSku',
      component: NewSkuPage
    },
    {
      path: '/skus/:id',
      name: 'ShowSku',
      component: ShowSkuPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/skus/:id/edit',
      name: 'EditSku',
      component: EditSkuPage,
      props (route) {
        return { id: route.params.id }
      }
    }
  ]
})
