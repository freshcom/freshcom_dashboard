<template>
  <div class="component-wrapper">
    <div class="account">
      <p class="text-center">{{sessionAccount.name}}</p>
    </div>
    <div class="primary-nav-scroller">
      <el-menu mode="vertical" :router="true" :default-active="selected" class="primary-nav">
        <el-menu-item :route="{ name: 'Home' }" index="/">
          <icon name="home" scale="1"></icon>
          <a>Home</a>
        </el-menu-item>

        <el-submenu index="storefront">
          <template slot="title">
            <icon name="shopping-bag" scale="0.8"></icon>
            <span>Storefront</span>
          </template>
          <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">
            <icon name="inbox" scale="1"></icon>
            <span>Orders</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">
            <icon name="users" scale="0.8"></icon>
            <span>Customers</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
            <icon name="cube" scale="0.8"></icon>
            <span>Products</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="inventory">
          <template slot="title">
            <icon name="archive" scale="0.8"></icon>
            <span>Goods</span>
          </template>
          <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">
            <icon name="cubes" scale="0.8"></icon>
            <span>Stockables</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">
            <icon name="unlock-alt" scale="0.8"></icon>
            <span>Unlockables</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">
            <icon name="diamond" scale="0.8"></icon>
            <span>Depositables</span>
          </el-menu-item>
<!--           <el-menu-item index="stockTransfers">
            <icon name="exchange" scale="0.8"></icon>
            <span>Stock Transfers</span>
          </el-menu-item>
          <el-menu-item index="branches">
            <icon name="bank" scale="0.8"></icon>
            <span>Branches</span>
          </el-menu-item> -->
        </el-submenu>

<!--         <el-submenu index="distribution">
          <template slot="title">
            <icon name="globe" scale="1"></icon>
            <span>Distribution</span>
          </template>
          <el-menu-item index="distributioDays">
            <icon name="calendar" scale="0.8"></icon>
            <span>Days</span>
          </el-menu-item>
          <el-menu-item index="distributioAreas">
            <icon name="map" scale="0.8"></icon>
            <span>Areas</span>
          </el-menu-item>
          <el-menu-item index="distributioTrips">
            <icon name="map-marker" scale="0.8"></icon>
            <span>Trips</span>
          </el-menu-item>
          <el-menu-item index="distributioVehicles">
            <icon name="truck" scale="0.8"></icon>
            <span>Vehicles</span>
          </el-menu-item>
        </el-submenu> -->

        <el-menu-item :route="{ name: 'ListExternalFile' }" index="/files">
          <icon name="folder" scale="0.8"></icon>
          <span>File Storage</span>
        </el-menu-item>

<!--         <el-submenu index="fileStorage">
          <template slot="title">
            <icon name="folder" scale="0.8"></icon>
            <span>File Storage</span>
          </template>
          <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">
            <icon name="folder-open" scale="0.8"></icon>
            <span>File Collections</span>
          </el-menu-item>
          <el-menu-item :route="{ name: 'ListExternalFile' }" index="/files">
            <icon name="file" scale="0.8"></icon>
            <span>Files</span>
          </el-menu-item>
        </el-submenu> -->

        <el-menu-item :route="{ name: 'ShowBillingSettings' }" index="/billing">
          <icon name="id-card" scale="0.8"></icon>
          <span>Billing</span>
        </el-menu-item>

        <el-menu-item index="operators">
          <icon name="id-card" scale="0.8"></icon>
          <span>Operators</span>
        </el-menu-item>

        <el-menu-item index="api">
          <icon name="terminal" scale="0.8"></icon>
          <span>API</span>
        </el-menu-item>
        <el-menu-item index="webhook">
          <icon name="podcast" scale="0.8"></icon>
          <span>Webhook</span>
        </el-menu-item>
        <el-menu-item index="settings">
          <icon name="cog" scale="0.8"></icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>


<script>
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/inbox'
import 'vue-awesome/icons/shopping-bag'
import 'vue-awesome/icons/users'
import 'vue-awesome/icons/cubes'
import 'vue-awesome/icons/unlock-alt'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/archive'
import 'vue-awesome/icons/cube'
import 'vue-awesome/icons/exchange'
import 'vue-awesome/icons/truck'
import 'vue-awesome/icons/terminal'
import 'vue-awesome/icons/bank'
import 'vue-awesome/icons/id-card'
import 'vue-awesome/icons/folder-open'
import 'vue-awesome/icons/folder'
import 'vue-awesome/icons/diamond'

import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/podcast'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/map'
import 'vue-awesome/icons/map-marker'
import 'vue-awesome/icons/globe'

export default {
  name: 'LeftNav',
  computed: {
    sessionAccount () {
      if (this.$store.state.session.account) {
        return this.$store.state.session.account
      }

      return {}
    },
    selected () {
      let routePath = this.$store.state.route.fullPath

      if (routePath.startsWith('/stockables')) { return '/stockables' }
      if (routePath.startsWith('/unlockables')) { return '/unlockables' }
      if (routePath.startsWith('/file')) { return '/files' }
      if (routePath.startsWith('/products')) { return '/products' }
      if (routePath.startsWith('/product_items')) { return '/products' }
      if (routePath.startsWith('/prices')) { return '/products' }
      if (routePath.startsWith('/product_collections')) { return '/products' }
      if (routePath.startsWith('/orders') || routePath.startsWith('/payments')) { return '/orders' }
      if (routePath.startsWith('/customers') || routePath.startsWith('/customers')) { return '/customers' }
      if (routePath.startsWith('/depositables') || routePath.startsWith('/depositables')) { return '/depositables' }

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
</style>
