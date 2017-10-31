// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import _ from 'lodash'
import jsonapiAxios from './api/jsonapi-axios'

import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'

import Icon from 'vue-awesome/components/Icon.vue'
import LeftNav from '@/components/left-nav'
import LocaleSelector from '@/components/locale-selector'

import VueI18n from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/env'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import en from '@/locales/en'
import zh from '@/locales/zh-CN'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import vueMoment from 'vue-moment'
import money from 'v-money'

// -- Sync Store & Router --
sync(store, router)

// -- Authentication for API --
jsonapiAxios.interceptors.request.use(function (config) {
  let accessToken = store.state.session.token.access_token
  config.headers = config.headers || {}
  config.headers['Authorization'] = `Bearer ${accessToken}`
  return config
}, function (error) {
  return Promise.reject(error)
})

// -- Global Component --
Vue.component('icon', Icon)
Vue.component('left-nav', LeftNav)
Vue.component('locale-selector', LocaleSelector)

// -- i18n --
Vue.use(VueI18n)
export const i18n = new VueI18n({
  locale: DEFAULT_LOCALE,
  messages: {
    'en': _.merge(elementEnLocale, en),
    'zh-CN': _.merge(elementZhLocale, zh)
  }
})

// -- Element UI --
Vue.use(ElementUI, {
  i18n (path, options) {
    // console.log(path, i18n.t(path))
    return i18n.t(path)
  }
})

// -- Moment.js --
Vue.use(vueMoment)
Vue.use(money, { precision: 2, masked: false, prefix: '$ ' })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
