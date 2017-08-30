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

import NewExternalFileCollectionPage from '@/pages/external-file-collection/new'
import EditExternalFileCollectionPage from '@/pages/external-file-collection/edit'
import ShowExternalFileCollectionPage from '@/pages/external-file-collection/show'
import ListExternalFileCollectionPage from '@/pages/external-file-collection/list'
import ListExternalFilePage from '@/pages/external-file/list'
import ShowExternalFilePage from '@/pages/external-file/show'

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
    },
    {
      path: '/file_collections',
      name: 'ListExternalFileCollection',
      component: ListExternalFileCollectionPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/file_collections/new',
      name: 'NewExternalFileCollection',
      component: NewExternalFileCollectionPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { skuId: query.skuId }
      }
    },
    {
      path: '/file_collections/:id',
      name: 'ShowExternalFileCollection',
      component: ShowExternalFileCollectionPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/file_collections/:id/edit',
      name: 'EditExternalFileCollection',
      component: EditExternalFileCollectionPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/files',
      name: 'ListExternalFile',
      component: ListExternalFilePage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/files/:id',
      name: 'ShowExternalFile',
      component: ShowExternalFilePage,
      props (route) {
        return { id: route.params.id }
      }
    }
  ]
})