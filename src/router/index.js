import Vue from 'vue'
import Router from 'vue-router'

import qs from 'qs'

import { DEFAULT_PAGE_SIZE } from '@/env'

import HomePage from '@/pages/home'
import LoginPage from '@/pages/login'

import ListOrderPage from '@/pages/order/list'
import NewOrderPage from '@/pages/order/new'
import ShowOrderPage from '@/pages/order/show'
import EditOrderPage from '@/pages/order/edit'

import ListPaymentPage from '@/pages/payment/list'
import ShowPaymentPage from '@/pages/payment/show'

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

import ListProductPage from '@/pages/product/list'
import NewProductPage from '@/pages/product/new'
import ShowProductPage from '@/pages/product/show'
import EditProductPage from '@/pages/product/edit'

import NewProductItemPage from '@/pages/product-item/new'
import ShowProductItemPage from '@/pages/product-item/show'
import ListProductItemPage from '@/pages/product-item/list'
import EditProductItemPage from '@/pages/product-item/edit'

import NewPricePage from '@/pages/price/new'
import EditPricePage from '@/pages/price/edit'
import ShowPricePage from '@/pages/price/show'

import ListUnlockablePage from '@/pages/unlockable/list'
import ShowUnlockablePage from '@/pages/unlockable/show'
import EditUnlockablePage from '@/pages/unlockable/edit'
import NewUnlockablePage from '@/pages/unlockable/new'

import ListCustomerPage from '@/pages/customer/list'
import ShowCustomerPage from '@/pages/customer/show'
import NewCustomerPage from '@/pages/customer/new'
import EditCustomerPage from '@/pages/customer/edit'

import ListPointDepositPage from '@/pages/point-deposit/list'
import NewPointDepositPage from '@/pages/point-deposit/new'
import ShowPointDepositPage from '@/pages/point-deposit/show'

import ShowBillingSettingsPage from '@/pages/billing/show-settings'

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
        return { id: route.params.id }
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

        return { skuId: query.skuId, productId: query.productId, callbackPath: query.callbackPath }
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
      path: '/product_items',
      name: 'ListProductItem',
      component: ListProductItemPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/product_items/new',
      name: 'NewProductItem',
      component: NewProductItemPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { productId: query.productId, callbackPath: query.callbackPath }
      }
    },
    {
      path: '/product_items/:id',
      name: 'ShowProductItem',
      component: ShowProductItemPage,
      props (route) {
        return { id: route.params.id }
      }
    },
    {
      path: '/product_items/:id/edit',
      name: 'EditProductItem',
      component: EditProductItemPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { id: route.params.id, callbackPath: query.callbackPath }
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
      path: '/point_deposits',
      name: 'ListPointDeposit',
      component: ListPointDepositPage,
      props (route) {
        let page = extractPagination(route)
        return {
          searchKeyword: route.query.search,
          page: page
        }
      }
    },
    {
      path: '/point_deposits/new',
      name: 'NewPointDeposit',
      component: NewPointDepositPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { callbackPath: query.callbackPath }
      }
    },
    {
      path: '/point_deposits/:id',
      name: 'ShowPointDeposit',
      component: ShowPointDepositPage,
      props (route) {
        return { id: route.params.id }
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
      component: NewCustomerPage,
      props (route) {
        return { id: route.params.id }
      }
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
      path: '/billing/settings',
      name: 'ShowBillingSettings',
      component: ShowBillingSettingsPage,
      props (route) {
        let queryString = route.fullPath.split('?')[1]
        let query = qs.parse(queryString)

        return { stripeCode: query.code, stripeScope: query.scope }
      }
    }
  ]
})
