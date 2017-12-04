import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import createLogger from 'vuex/dist/logger'

import freshcom from '@/freshcom-sdk'

import { DEFAULT_LOCALE } from '@/env'

import SessionStore from '@/store/modules/session'
import StockableStore from '@/store/modules/stockable'
import { Store as ExternalFileStore, Plugin as ExternalFilePlugin } from '@/store/modules/external-file'
import ExternalFileCollectionStore from '@/store/modules/external-file-collection'
import ProductStore from '@/store/modules/product'
import ProductItemStore from '@/store/modules/product-item'
import PriceStore from '@/store/modules/price'
import OrderStore from '@/store/modules/order'
import OrderLineItemStore from '@/store/modules/order-line-item'
import PaymentStore from '@/store/modules/payment'
import UnlockableStore from '@/store/modules/unlockable'
import CustomerStore from '@/store/modules/customer'
import BillingStore from '@/store/modules/billing'
import DepositableStore from '@/store/modules/depositable'

Vue.use(Vuex)

const MT = {
  PUSH_ROUTE: 'PUSH_ROUTE',
  POP_ROUTE: 'POP_ROUTE',
  SET_RESOURCE_LOCALE: 'SET_RESOURCE_LOCALE'
}

export default new Vuex.Store({
  strict: true,
  plugins: [createLogger(), ExternalFilePlugin],
  modules: {
    session: SessionStore,
    externalFileCollection: ExternalFileCollectionStore,
    externalFile: ExternalFileStore,
    stockable: StockableStore,
    product: ProductStore,
    productItem: ProductItemStore,
    price: PriceStore,
    order: OrderStore,
    orderLineItem: OrderLineItemStore,
    payment: PaymentStore,
    unlockable: UnlockableStore,
    customer: CustomerStore,
    billing: BillingStore,
    depositable: DepositableStore
  },
  state: {
    uiLocale: DEFAULT_LOCALE,
    resourceLocale: DEFAULT_LOCALE
  },
  actions: {
    pushRoute ({ commit }, route) {
      commit(MT.PUSH_ROUTE, route)
    },

    popRoute ({ commit }, n) {
      commit(MT.POP_ROUTE, n)
    },

    setResourceLocale ({ commit }, locale) {
      commit(MT.SET_RESOURCE_LOCALE, locale)
    }
  },
  mutations: {
    [MT.PUSH_ROUTE] (state, route) {
      router.push(route)
    },

    [MT.POP_ROUTE] (state, n) {
      router.go(-n)
    },

    [MT.SET_RESOURCE_LOCALE] (state, locale) {
      state.resourceLocale = locale
      freshcom.setLocale(locale)
    }
  }
})
