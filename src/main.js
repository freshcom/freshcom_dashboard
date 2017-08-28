// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import _ from 'lodash'

// -- Sync Store & Router --
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
sync(store, router)

// -- Authentication for API --
import jsonapiAxios from './api/jsonapi-axios'

jsonapiAxios.interceptors.request.use(function (config) {
  let accessToken = store.state.session.record.access_token
  // debugger
  config.headers = config.headers || {}
  config.headers['Authorization'] = `Bearer ${accessToken}`
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// -- Global Component --
import Icon from 'vue-awesome/components/Icon.vue'
import LeftNav from '@/components/left-nav'
import LocaleSelector from '@/components/locale-selector'
Vue.component('icon', Icon)
Vue.component('left-nav', LeftNav)
Vue.component('locale-selector', LocaleSelector)

// -- i18n --
import VueI18n from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/env'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import en from '@/locales/en'
import zh from '@/locales/zh-CN'

Vue.use(VueI18n)
export const i18n = new VueI18n({
  locale: DEFAULT_LOCALE,
  messages: {
    'en': _.merge(elementEnLocale, en),
    'zh-CN': _.merge(elementZhLocale, zh)
  }
})

// -- Element UI --
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI, {
  i18n (path, options) {
    console.log(path, i18n.t(path))
    return i18n.t(path)
  }
})

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
