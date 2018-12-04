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

import App from '@/app'
import LeftNav from '@/components/left-nav'
import TopNav from '@/components/top-nav'
import LocaleSelector from '@/components/locale-selector'

import 'vue-awesome/icons/filter' // Filter
import 'vue-awesome/icons/sign-in-alt' // Import
import 'vue-awesome/icons/sign-out-alt' // Export
import 'vue-awesome/icons/share' // Filter
import 'vue-awesome/icons/folder' // File Collection
import 'vue-awesome/icons/user' // Customer
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/file-alt' // Order
import 'vue-awesome/icons/tag' // Product
import 'vue-awesome/icons/tags' // Product Collection
import 'vue-awesome/icons/dollar-sign' // Price
import 'vue-awesome/icons/truck' // Fulfillment
import 'vue-awesome/icons/unlock' // Unlock
import 'vue-awesome/icons/external-link-alt' // Notification Trigger
import 'vue-awesome/icons/regular/file-code' // Email & SMS Template
import 'vue-awesome/icons/envelope' // Email
import 'vue-awesome/icons/comment' // SMS
import 'vue-awesome/icons/cubes' // Stockable
import 'vue-awesome/icons/shopping-bag' // Fulfillment Package
import 'vue-awesome/icons/shopping-cart' // Storefront
import 'vue-awesome/icons/university' // Balance
import 'vue-awesome/icons/money-bill-alt' // Payment
import 'vue-awesome/icons/search' // Search
import 'vue-awesome/icons/id-card' // Team

// -- Code Mirror Style --
import 'codemirror/mode/xml/xml'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/handlebars/handlebars'
import 'codemirror/lib/codemirror.css'

// -- Sync Store & Router --
sync(store, router)

// -- Global Component --
Vue.component('icon', Icon)
Vue.component('left-nav', LeftNav)
Vue.component('top-nav', TopNav)
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

// new Vue({
//   el: '#app',
//   router,
//   store,
//   i18n,
//   template: '<App/>',
//   components: { App }
// })

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
