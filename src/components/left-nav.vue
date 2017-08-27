<template>
  <div>
    <div class="account">
      <p class="text-center">{{sessionAccount.name}}</p>
    </div>
    <div class="primary-nav-scroller">
      <el-menu mode="vertical" :router="true" :default-active="selected" class="primary-nav">

        <el-menu-item index="/">
          <icon name="home" scale="1"></icon>
          <a>Home</a>
        </el-menu-item>

        <el-menu-item index="orders">
          <icon name="inbox" scale="1"></icon>
          <span>Orders</span>
        </el-menu-item>

        <el-menu-item index="customers">
          <icon name="users" scale="0.8"></icon>
          <span>Customers</span>
        </el-menu-item>

        <el-menu-item index="products">
          <icon name="cubes" scale="0.8"></icon>
          <span>Products</span>
        </el-menu-item>

        <el-menu-item index="unlockables">
          <icon name="unlock-alt" scale="0.8"></icon>
          <span>Unlockables</span>
        </el-menu-item>

        <el-submenu index="inventory">
          <template slot="title">
            <icon name="archive" scale="0.8"></icon>
            <span>Inventory</span>
          </template>
          <el-menu-item index="skus">
            <icon name="cube" scale="0.8"></icon>
            <span>SKUs</span>
          </el-menu-item>
          <el-menu-item index="stockTransfers">
            <icon name="exchange" scale="0.8"></icon>
            <span>Stock Transfers</span>
          </el-menu-item>
          <el-menu-item index="branches">
            <icon name="bank" scale="0.8"></icon>
            <span>Branches</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="distribution">
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
        </el-submenu>

        <el-menu-item index="operators">
          <icon name="id-card" scale="0.8"></icon>
          <span>Operators</span>
        </el-menu-item>

        <el-menu-item index="files">
          <icon name="file" scale="0.8"></icon>
          <span>Files</span>
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

import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/podcast'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/map'
import 'vue-awesome/icons/map-marker'
import 'vue-awesome/icons/globe'

export default {
  name: 'LeftNav',
  props: {
    selected: {
      type: String,
      default () {
        return 'home'
      }
    }
  },
  computed: {
    sessionAccount: function () {
      if (this.$store.state.session.account) {
        return this.$store.state.session.account
      }

      return {}
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
.account {
  margin: 10px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}

.primary-nav-scroller {
  height: calc(100vh - 70px);
  overflow-y: scroll;
}

.primary-nav {
  padding-bottom: 20px;
}

/* START Left Nav */
.el-menu-item a {
  text-decoration: none;
  color: #48576a;

  &:hover {
    color: #48576a;
  }
}

.el-menu-item-group__title {
  padding-bottom: 10px;
}

.el-menu-item.is-active a {
  font-weight: 500;
  color: #20a0ff;
}

.el-submenu .el-menu {
  background-color: #eef1f6;
}

.el-menu-item, .el-submenu__title, .el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
}

.el-menu-item .fa-icon, .el-submenu .fa-icon {
  width: 20px;
}

.el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
  background-color: inherit;
  font-weight: 500;
}

.el-menu-item .fa-icon, .el-menu-item span {
  vertical-align: middle;
}
/* END Left Nav */

</style>
