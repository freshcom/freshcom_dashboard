import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import createLogger from 'vuex/dist/logger'

import freshcom from '@/freshcom-sdk'

import { DEFAULT_LOCALE } from '@/env'

import SessionStore from '@/store/modules/session'

Vue.use(Vuex)

const MT = {
  PUSH_ROUTE: 'PUSH_ROUTE',
  POP_ROUTE: 'POP_ROUTE',
  SET_RESOURCE_LOCALE: 'SET_RESOURCE_LOCALE',
  LOADING_CHANGED: 'LOADING_CHANGED'
}

export default new Vuex.Store({
  strict: true,
  plugins: [createLogger()],
  modules: {
    session: SessionStore
  },
  state: {
    isLoading: false,
    loadingInstance: undefined,

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
    },

    setLoading ({ commit }, isLoading) {
      commit(MT.LOADING_CHANGED, isLoading)
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
    },

    [MT.LOADING_CHANGED] (state, isLoading) {
      state.isLoading = isLoading
    }
  }
})
