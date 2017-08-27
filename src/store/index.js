import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'

import { Store as SessionStore } from '@/store/modules/session'

Vue.use(Vuex)

const MT = {
  PUSH_ROUTE: 'PUSH_ROUTE',
  SET_RESOURCE_LOCALE: 'SET_RESOURCE_LOCALE'
}

export default new Vuex.Store({
  strict: true,
  modules: {
    session: SessionStore
  },
  actions: {
    pushRoute ({ commit }, route) {
      commit(MT.PUSH_ROUTE, route)
    },

    setResourceLocale ({ commit }, locale) {
      commit(MT.SET_RESOURCE_LOCALE, locale)
    }
  },
  mutations: {
    [MT.PUSH_ROUTE] (state, route) {
      router.push(route)
    },

    [MT.SET_RESOURCE_LOCALE] (state, locale) {
      state.resourceLocale = locale
    }
  }
})
