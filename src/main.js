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
import '@/assets/element-theme.scss'

import vueMoment from 'vue-moment'
import money from 'v-money'

import App from './app'
import LeftNav from '@/components/left-nav'
import LocaleSelector from '@/components/locale-selector'

import 'vue-awesome/icons/filter' // Filter
import 'vue-awesome/icons/sign-in' // Import
import 'vue-awesome/icons/sign-out' // Export
import 'vue-awesome/icons/share' // Filter
import 'vue-awesome/icons/folder' // File Collection
import 'vue-awesome/icons/user' // Customer
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/file-text' // Order
import 'vue-awesome/icons/tag' // Product
import 'vue-awesome/icons/tags' // Product Collection
import 'vue-awesome/icons/dollar' // Product Collection
import 'vue-awesome/icons/truck' // Fulfillment
import 'vue-awesome/icons/unlock' // Unlock
import 'vue-awesome/icons/external-link' // Notification Trigger
import 'vue-awesome/icons/file-code-o' // Email & SMS Template
import 'vue-awesome/icons/envelope' // Email
import 'vue-awesome/icons/comment' // SMS

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
