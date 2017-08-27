// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

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
Vue.component('icon', Icon)
Vue.component('left-nav', LeftNav)

// -- Element UI --
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
