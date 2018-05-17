<template>
  <div class="component-wrapper">
    <div class="account">
      <p class="text-center">{{sessionAccount.name}}</p>
    </div>
    <div class="primary-nav-scroller">
      <el-menu mode="vertical" :router="true" :default-active="selected" class="primary-nav">
        <el-menu-item :route="{ name: 'Home' }" index="/">
          <icon name="home" scale="0.9"></icon>
          <a>Home</a>
        </el-menu-item>

        <el-submenu index="storefront">
          <template slot="title">
            <icon name="shopping-cart" scale="0.9"></icon>
            <span>Storefront</span>
          </template>
          <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">
            <icon name="file-text" scale="0.9"></icon>
            <span>Orders</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
            <icon name="tag" scale="0.9"></icon>
            <span>Products</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">
            <icon name="user" scale="0.9"></icon>
            <span>Customers</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="balance">
          <template slot="title">
            <icon name="bank" scale="0.9"></icon>
            <span>Balance</span>
          </template>
          <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">
            <icon name="money" scale="0.9"></icon>
            <span>Payments</span>
          </el-menu-item>
<!--           <el-menu-item :route="{ name: 'ListUnlock' }" index="/unlocks">
            <icon name="unlock" scale="0.9"></icon>
            <span>Unlocks</span>
          </el-menu-item> -->
        </el-submenu>

        <el-submenu index="fulfillment">
          <template slot="title">
            <icon name="truck" scale="0.9"></icon>
            <span>Fulfillment</span>
          </template>
          <el-menu-item :route="{ name: 'ListFulfillmentPackage' }" index="/fulfillment-packages">
            <icon name="shopping-bag" scale="0.9"></icon>
            <span>Packages</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListUnlock' }" index="/unlocks">
            <icon name="unlock" scale="0.9"></icon>
            <span>Unlocks</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="inventory">
          <template slot="title">
            <icon name="archive" scale="0.9"></icon>
            <span id="nav-goods">Goods</span>
          </template>
          <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">
            <icon name="cubes" scale="0.9"></icon>
            <span id="nav-stockables">Stockables</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">
            <icon name="unlock-alt" scale="0.9"></icon>
            <span>Unlockables</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">
            <icon name="diamond" scale="0.9"></icon>
            <span>Depositables</span>
          </el-menu-item>
<!--           <el-menu-item index="stockTransfers">
            <icon name="exchange" scale="0.9"></icon>
            <span>Stock Transfers</span>
          </el-menu-item>
          <el-menu-item index="branches">
            <icon name="bank" scale="0.9"></icon>
            <span>Branches</span>
          </el-menu-item> -->
        </el-submenu>

<!--         <el-submenu index="distribution">
          <template slot="title">
            <icon name="globe" scale="0.9"></icon>
            <span>Distribution</span>
          </template>
          <el-menu-item index="distributioDays">
            <icon name="calendar" scale="0.9"></icon>
            <span>Days</span>
          </el-menu-item>
          <el-menu-item index="distributioAreas">
            <icon name="map" scale="0.9"></icon>
            <span>Areas</span>
          </el-menu-item>
          <el-menu-item index="distributioTrips">
            <icon name="map-marker" scale="0.9"></icon>
            <span>Trips</span>
          </el-menu-item>
          <el-menu-item index="distributioVehicles">
            <icon name="truck" scale="0.9"></icon>
            <span>Vehicles</span>
          </el-menu-item>
        </el-submenu> -->

        <el-submenu index="notification">
          <template slot="title">
            <icon name="send" scale="0.9"></icon>
            <span>Notification</span>
          </template>

          <el-menu-item :route="{ name: 'ListNotificationTrigger' }" index="/notification-triggers">
            <icon name="external-link" scale="0.9"></icon>
            <span>Triggers</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListEmail' }" index="/emails">
            <icon name="envelope" scale="0.9"></icon>
            <span>Emails</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListSms' }" index="/sms">
            <icon name="comment" scale="0.9"></icon>
            <span>SMS</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item :route="{ name: 'ListFileCollection' }" index="/file-collections">
          <icon name="folder" scale="0.9"></icon>
          <span>File Storage</span>
        </el-menu-item>

<!--         <el-submenu index="fileStorage">
          <template slot="title">
            <icon name="folder" scale="0.9"></icon>
            <span>File Storage</span>
          </template>
          <el-menu-item :route="{ name: 'ListFileCollection' }" index="/file_collections">
            <icon name="folder-open" scale="0.9"></icon>
            <span>File Collections</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListFile' }" index="/files">
            <icon name="file" scale="0.9"></icon>
            <span>Files</span>
          </el-menu-item>
        </el-submenu> -->

        <el-menu-item :router="{ name: 'APIHome' }" index="/api">
          <icon name="terminal" scale="0.9"></icon>
          <span>API</span>
        </el-menu-item>

        <el-menu-item index="" style="padding-left: 12px;" class="no-active">
          <el-switch :value="isViewingTestData" @input="toggleMode()" :width="23" active-color="#f79a59" class="nav-switch">
          </el-switch>

          <span @click="toggleMode()" :class="{ 'mode-test': isViewingTestData }">
            <span v-if="isViewingTestData">Viewing test data</span>
            <span v-else>View test data</span>
            <span v-loading="isTogglingMode" element-loading-spinner="el-icon-loading" class="test-toggle-loading"></span>
          </span>
        </el-menu-item>

        <el-menu-item index="operators">
          <icon name="id-card" scale="0.9"></icon>
          <span>Operators</span>
        </el-menu-item>

        <el-menu-item index="settings">
          <icon name="cog" scale="0.9"></icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import 'vue-awesome/icons/send'
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/cubes'
import 'vue-awesome/icons/unlock-alt'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/archive'
import 'vue-awesome/icons/exchange'
import 'vue-awesome/icons/truck'
import 'vue-awesome/icons/terminal'
import 'vue-awesome/icons/id-card'
import 'vue-awesome/icons/folder-open'
import 'vue-awesome/icons/diamond'

import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/podcast'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/map'
import 'vue-awesome/icons/map-marker'
import 'vue-awesome/icons/globe'

export default {
  name: 'LeftNav',
  data () {
    return {
      isTogglingMode: false
    }
  },
  computed: {
    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    },
    sessionAccount () {
      if (this.$store.state.session.account) {
        return this.$store.state.session.account
      }

      return {}
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    },
    selected () {
      let routePath = this.currentRoutePath
      if (routePath.startsWith('/stockables')) { return '/stockables' }
      if (routePath.startsWith('/unlockables')) { return '/unlockables' }
      if (routePath.startsWith('/file')) { return '/file-collections' }

      if (routePath.startsWith('/products')) { return '/products' }
      if (routePath.startsWith('/prices')) { return '/products' }
      if (routePath.startsWith('/product-collections')) { return '/products' }

      if (routePath.startsWith('/orders')) { return '/orders' }
      if (routePath.startsWith('/customers') || routePath.startsWith('/customers')) { return '/customers' }
      if (routePath.startsWith('/depositables') || routePath.startsWith('/depositables')) { return '/depositables' }

      if (routePath.startsWith('/payments')) { return '/payments' }

      if (routePath.startsWith('/emails')) { return '/emails' }
      if (routePath.startsWith('/email-templates')) { return '/emails' }
      if (routePath.startsWith('/sms')) { return '/sms' }
      if (routePath.startsWith('/sms-templates')) { return '/sms' }

      if (routePath.startsWith('/notification-triggers')) { return '/notification-triggers' }

      return routePath
    },
    isDashboardActive: function () {
      return this.selected === 'dashboard'
    },
    isOrderActive: function () {
      return this.selected === 'orders'
    },
    isCustomerActive: function () {
      return this.selected === 'customers'
    },
    isMenuActive: function () {
      return this.selected === 'menu'
    }
  },
  methods: {
    toggleMode () {
      this.isTogglingMode = true

      let toggled
      if (this.isViewingTestData) {
        toggled = this.$store.dispatch('session/setMode', 'live')
      } else {
        toggled = this.$store.dispatch('session/setMode', 'test')
      }

      let excludedRoute = ['ShowBalanceSettings']
      toggled.then(() => {
        let routeInfo = this.currentRoutePath.split('/')
        if (routeInfo.length > 2 && !_.includes(excludedRoute, this.$store.state.route.name)) {
          this.$store.dispatch('pushRoute', { path: `/${routeInfo[1]}` })
        }
        this.isTogglingMode = false
      }).catch(() => {
        this.isTogglingMode = false
      })
    }
  }
}
</script>

<style lang="scss">
.primary-nav .el-menu-item, .primary-nav .el-submenu__title {
  height: 40px;
  line-height: 40px;

  svg {
    margin-right: 3px;
  }
}

.primary-nav .el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.primary-nav.el-menu, .primary-nav .el-menu {
  border-right: none;
  background-color: inherit;
}

.primary-nav .el-submenu__title:hover, .primary-nav .el-menu-item:focus, .primary-nav .el-menu-item:hover {
  background-color: inherit;
  font-weight: 500;
}

.account {
  margin: 10px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}

.primary-nav {
  padding-bottom: 20px;
}

.nav-switch {
  .el-switch__core {
    height: 14px;

    .el-switch__button {
      top: 0px;
      left: 0px;
      height: 12px;
      width: 12px;
    }
  }

  &.is-checked {
    .el-switch__core > .el-switch__button {
      transform: translate3d(9px, 0px, 0px) !important;
    }
  }
}

.mode-test {
  color: #f79a59;
  font-weight: 500;
}

.el-menu-item.is-active.no-active {
  color: #2d2f33;
}

.test-toggle-loading {
  float: right;
  margin-top: 22px;

  .el-icon-loading {
    font-size: 16px;
  }
}
</style>
