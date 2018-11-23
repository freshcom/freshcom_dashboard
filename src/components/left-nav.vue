<template>
<div class="left-nav">
  <div class="account">
    <p class="text-center">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{sessionAccount.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>Placeholder</el-dropdown-item>
          <el-dropdown-item>Placeholder</el-dropdown-item>
          <el-dropdown-item divided>
            <a href="javascript:;">Create new account</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </p>
  </div>

  <el-menu mode="vertical" :router="true" :default-active="selected">
    <el-menu-item :route="{ name: 'Home' }" index="/">
      <icon name="home" scale="0.9"></icon>
      <span>Home</span>
    </el-menu-item>

    <el-submenu index="storefront">
      <template slot="title">
        <icon name="shopping-cart" scale="0.9"></icon>
        <span id="nav-storefront">Storefront</span>
      </template>
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">
        <icon name="file-alt" scale="0.9"></icon>
        <span id="nav-orders">Orders</span>
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
        <icon name="tag" scale="0.9"></icon>
        <span id="nav-products">Products</span>
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">
        <icon name="user" scale="0.9"></icon>
        <span id="nav-customers">Customers</span>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="balance">
      <template slot="title">
        <icon name="university" scale="0.9"></icon>
        <span>Balance</span>
      </template>
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">
        <icon name="money-bill-alt"></icon>
        <span>Payments</span>
      </el-menu-item>
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
        <icon name="gem" scale="0.9"></icon>
        <span>Depositables</span>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="notification">
      <template slot="title">
        <icon name="paper-plane" scale="0.9"></icon>
        <span>Notification</span>
      </template>

      <el-menu-item :route="{ name: 'ListNotificationTrigger' }" index="/notification-triggers">
        <icon name="external-link-alt" scale="0.9"></icon>
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

    <el-menu-item index="/users">
      <icon name="id-card" scale="0.9"></icon>
      <span id="nav-team">Team</span>
    </el-menu-item>

    <el-menu-item :router="{ name: 'APIHome' }" index="/api">
      <icon name="terminal" scale="0.9"></icon>
      <span>API</span>
    </el-menu-item>

    <el-menu-item index="" style="padding-left: 12px;" class="no-active">
      <el-switch :value="isViewingTestData" :width="23" @input="toggleMode()" active-color="#f79a59" class="nav-switch">
      </el-switch>

      <span @click="toggleMode()" :class="{ 'mode-test': isViewingTestData }">
        <span v-if="isViewingTestData">Viewing test data</span>
        <span v-else>View test data</span>
        <span v-loading="isTogglingMode" element-loading-spinner="el-icon-loading" class="test-toggle-loading"></span>
      </span>
    </el-menu-item>

    <el-menu-item index="settings">
      <icon name="cog" scale="0.9"></icon>
      <span>Settings</span>
    </el-menu-item>
  </el-menu>
</div>
</template>

<script>
import _ from 'lodash'

import 'vue-awesome/icons/paper-plane'
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/cubes'
import 'vue-awesome/icons/unlock-alt'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/archive'
import 'vue-awesome/icons/exchange-alt'
import 'vue-awesome/icons/truck'
import 'vue-awesome/icons/terminal'
import 'vue-awesome/icons/folder-open'
import 'vue-awesome/icons/gem'

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

      if (routePath === '/') { return '/' }

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
      if (routePath.startsWith('/users')) { return '/users' }

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
.left-nav {
  display: flex;
  flex-direction: column;
  border-right: solid 1px #e6e6e6;
  height: 100%;

  ul {
    border-right: 0px;
  }

  .el-submenu__title, .el-menu-item, .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
    svg {
      margin-right: 6px;
    }
  }

  .account {
    height: 60px;

    .el-dropdown-link {
      cursor: pointer;
    }

    p {
      margin-top: 24px;
    }
  }

  .test-toggle-loading {
    float: right;
    margin-right: 6px;
    margin-top: 22px;

    .el-icon-loading {
      font-size: 16px;
    }
  }

  .mode-test {
    color: #f79a59;
    font-weight: 500;
  }
}

.nav-switch {
  .el-switch__core {
    height: 14px;

    &:after {
      top: 0px;
      left: 0px;
      width: 12px;
      height: 12px;
    }
  }

  &.is-checked {
    .el-switch__core:after {
      margin-left: -12px;
    }
  }
}
</style>
