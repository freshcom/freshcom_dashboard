// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import _ from 'lodash'

import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'

import Icon from 'vue-awesome/components/Icon.vue'

import i18n from '@/i18n'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import vueMoment from 'vue-moment'
import money from 'v-money'

import App from './app'
import LeftNav from '@/components/left-nav'
import LocaleSelector from '@/components/locale-selector'

// -- Sync Store & Router --
sync(store, router)

// -- Global Component --
Vue.component('icon', Icon)
Vue.component('left-nav', LeftNav)
Vue.component('locale-selector', LocaleSelector)

// -- Element UI --
Vue.use(ElementUI, {
  i18n (path, options) {
    // console.log(path, i18n.t(path))
    return i18n.t(path)
  }
})

// -- Moment.js --
Vue.use(vueMoment, { defaultFormat: 'YYYY-MM', defaultFormatUtc: 'YYYY-MM' })
Vue.moment.defaultFormat = 'MMM DD YYYY HH:mm:ss'

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
