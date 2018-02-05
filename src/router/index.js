import Vue from 'vue'
import Router from 'vue-router'
import qs from 'qs'
import _ from 'lodash'

import { DEFAULT_PAGE_SIZE } from '@/env'
import store from '@/store'

import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'
import ForgotPasswordPage from '@/pages/forgot-password'

// Storefront
import ListOrderPage from '@/pages/order/list'
import NewOrderPage from '@/pages/order/new'
import ShowOrderPage from '@/pages/order/show'
import EditOrderPage from '@/pages/order/edit'

import ListCustomerPage from '@/pages/customer/list'
import ShowCustomerPage from '@/pages/customer/show'
import NewCustomerPage from '@/pages/customer/new'
import EditCustomerPage from '@/pages/customer/edit'

import ListPaymentPage from '@/pages/payment/list'
import ShowPaymentPage from '@/pages/payment/show'

import ListProductPage from '@/pages/product/list'
import NewProductPage from '@/pages/product/new'
import ShowProductPage from '@/pages/product/show'
import EditProductPage from '@/pages/product/edit'

import ListProductCollectionPage from '@/pages/product-collection/list'
import NewProductCollectionPage from '@/pages/product-collection/new'
import ShowProductCollectionPage from '@/pages/product-collection/show'
import EditProductCollectionPage from '@/pages/product-collection/edit'

import NewPricePage from '@/pages/price/new'
import EditPricePage from '@/pages/price/edit'
import ShowPricePage from '@/pages/price/show'

// Goods
import ListStockablePage from '@/pages/stockable/list'
import ShowStockablePage from '@/pages/stockable/show'
import EditStockablePage from '@/pages/stockable/edit'
import NewStockablePage from '@/pages/stockable/new'

import ListUnlockablePage from '@/pages/unlockable/list'
import ShowUnlockablePage from '@/pages/unlockable/show'
import EditUnlockablePage from '@/pages/unlockable/edit'
import NewUnlockablePage from '@/pages/unlockable/new'

import ListDepositablePage from '@/pages/depositable/list'
import NewDepositablePage from '@/pages/depositable/new'
import ShowDepositablePage from '@/pages/depositable/show'
import EditDepositablePage from '@/pages/depositable/edit'

// Notification
import ListEmailPage from '@/pages/email/list'
import ListEmailTemplatePage from '@/pages/email-template/list'
import NewEmailTemplatePage from '@/pages/email-template/new'
import ShowEmailTemplatePage from '@/pages/email-template/show'
import EditEmailTemplatePage from '@/pages/email-template/edit'

import ListNotificationTriggerPage from '@/pages/notification-trigger/list'
import NewNotificationTriggerPage from '@/pages/notification-trigger/new'
import ShowNotificationTriggerPage from '@/pages/notification-trigger/show'

// File Storage
import NewFileCollectionPage from '@/pages/file-collection/new'
import EditFileCollectionPage from '@/pages/file-collection/edit'
import ShowFileCollectionPage from '@/pages/file-collection/show'
import ListFileCollectionPage from '@/pages/file-collection/list'

import ListFilePage from '@/pages/file/list'
import ShowFilePage from '@/pages/file/show'

import ShowBalanceSettingsPage from '@/pages/balance/settings'
import APIHomePage from '@/pages/api/home'

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

const router = new Router({
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
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordPage
    },
    {
      path: '/orders',
      name: 'ListOrder',
      component: ListOrderPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/orders/new',
      name: 'NewOrder',
      component: NewOrderPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { customerId: query.customerId, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/orders/:id',
      name: 'ShowOrder',
      component: ShowOrderPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/orders/:id/edit',
      name: 'EditOrder',
      component: EditOrderPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/payments',
      name: 'ListPayment',
      component: ListPaymentPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/payments/:id',
      name: 'ShowPayment',
      component: ShowPaymentPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/stockables',
      name: 'ListStockable',
      component: ListStockablePage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/stockables/new',
      name: 'NewStockable',
      component: NewStockablePage
    },
    {
      path: '/stockables/:id',
      name: 'ShowStockable',
      component: ShowStockablePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/stockables/:id/edit',
      name: 'EditStockable',
      component: EditStockablePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/file_collections',
      name: 'ListFileCollection',
      component: ListFileCollectionPage,
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
      name: 'NewFileCollection',
      component: NewFileCollectionPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { ownerId: query.ownerId, ownerType: query.ownerType, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/file_collections/:id',
      name: 'ShowFileCollection',
      component: ShowFileCollectionPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/file_collections/:id/edit',
      name: 'EditFileCollection',
      component: EditFileCollectionPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/files',
      name: 'ListFile',
      component: ListFilePage,
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
      name: 'ShowFile',
      component: ShowFilePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/products',
      name: 'ListProduct',
      component: ListProductPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/products/new',
      name: 'NewProduct',
      component: NewProductPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { kind: query.kind, parentId: query.parentId, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/products/:id',
      name: 'ShowProduct',
      component: ShowProductPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/products/:id/edit',
      name: 'EditProduct',
      component: EditProductPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/product-collections',
      name: 'ListProductCollection',
      component: ListProductCollectionPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/product-collections/new',
      name: 'NewProductCollection',
      component: NewProductCollectionPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { callbackPath: query.callbackPath }
      }
    },
    {
      path: '/product-collections/:id',
      name: 'ShowProductCollection',
      component: ShowProductCollectionPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/product-collections/:id/edit',
      name: 'EditProductCollection',
      component: EditProductCollectionPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/prices/new',
      name: 'NewPrice',
      component: NewPricePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { productKind: query.productKind, productId: query.productId, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/prices/:id',
      name: 'ShowPrice',
      component: ShowPricePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/prices/:id/edit',
      name: 'EditPrice',
      component: EditPricePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/depositables',
      name: 'ListDepositable',
      component: ListDepositablePage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/depositables/new',
      name: 'NewDepositable',
      component: NewDepositablePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { callbackPath: query.callbackPath }
      }
    },
    {
      path: '/depositables/:id',
      name: 'ShowDepositable',
      component: ShowDepositablePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/depositables/:id/edit',
      name: 'EditDepositable',
      component: EditDepositablePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/unlockables',
      name: 'ListUnlockable',
      component: ListUnlockablePage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/unlockables/new',
      name: 'NewUnlockable',
      component: NewUnlockablePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { customerId: query.customerId, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/unlockables/:id',
      name: 'ShowUnlockable',
      component: ShowUnlockablePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/unlockables/:id/edit',
      name: 'EditUnlockable',
      component: EditUnlockablePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/customers',
      name: 'ListCustomer',
      component: ListCustomerPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/customers/new',
      name: 'NewCustomer',
      component: NewCustomerPage
    },
    {
      path: '/customers/:id',
      name: 'ShowCustomer',
      component: ShowCustomerPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/customers/:id/edit',
      name: 'EditCustomer',
      component: EditCustomerPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/emails',
      name: 'ListEmail',
      component: ListEmailPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/email-templates',
      name: 'ListEmailTemplate',
      component: ListEmailTemplatePage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/email-templates/new',
      name: 'NewEmailTemplate',
      component: NewEmailTemplatePage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { callbackPath: query.callbackPath }
      }
    },
    {
      path: '/email-templates/:id',
      name: 'ShowEmailTemplate',
      component: ShowEmailTemplatePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/email-templates/:id/edit',
      name: 'EditEmailTemplate',
      component: EditEmailTemplatePage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/notification-triggers',
      name: 'ListNotificationTrigger',
      component: ListNotificationTriggerPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/notification-triggers/new',
      name: 'NewNotificationTrigger',
      component: NewNotificationTriggerPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/notification-triggers/:id',
      name: 'ShowNotificationTrigger',
      component: ShowNotificationTriggerPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/balance/settings',
      name: 'ShowBalanceSettings',
      component: ShowBalanceSettingsPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { stripeCode: query.code, stripeScope: query.scope }
      }
    },
    {
      path: '/api',
      name: 'APIHome',
      component: APIHomePage
    }
  ]
})

router.beforeEach((to, from, next) => {
  let isSessionReady = store.state.session.ready
  let excludedRouteNames = ['Login', 'Register', 'ForgotPassword']

  let _resolve
  let currentUserPromise = new Promise((resolve) => {
    _resolve = resolve
  })

  if (!isSessionReady) {
    store.dispatch('setLoading', true)
    store.dispatch('session/retrieveFromStorage').then(() => {
      store.dispatch('setLoading', false)
      _resolve(store.state.session.user)
    })
  } else {
    _resolve(store.state.session.user)
  }

  currentUserPromise.then(currentUser => {
    if (!currentUser && !_.includes(excludedRouteNames, to.name)) {
      store.dispatch('pushRoute', { name: 'Login' })
    } else {
      next()
    }
  })
})

export default router
