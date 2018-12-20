<template>
<div class="left-nav">
  <div class="account">
    <p class="text-center">
      <el-dropdown v-if="can('manageAccount')" trigger="click" @command="(cmd) => { this[cmd]() }">
        <span class="el-dropdown-link">
          {{currentAccount.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="openListAccountDialog">List all accounts</el-dropdown-item>
          <el-dropdown-item divided command="openCreateAccountDialog">
            <a href="javascript:;">Create new account</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span v-else>{{currentAccount.name}}</span>
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

    <el-menu-item v-if="can('viewDevelopment')" :router="{ name: 'DevelopmentOverview' }" index="/development">
      <icon name="terminal" scale="0.9"></icon>
      <span>Development</span>
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

    <el-menu-item v-if="can('viewTeam')" index="/team">
      <icon name="id-card" scale="0.9"></icon>
      <span id="nav-team">Team</span>
    </el-menu-item>

    <el-menu-item v-if="can('viewAccountSettings')" :router="{ name: 'AccountOverview' }" index="/account">
      <icon name="cog" scale="0.9"></icon>
      <span>Account Settings</span>
    </el-menu-item>
  </el-menu>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isCreateAccountDialogVisible" title="Create new account" width="400px">
      <el-form @submit.native.prevent="submit()" label-width="120px" size="small">
        <el-form-item :error="errorMsgs.name" label="Name">
          <el-input v-model="accountDraft.name" id="name" placeholder="Enter a name..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.defaultLocale" label="Default Locale">
          <el-select v-model="accountDraft.defaultLocale" placeholder="Please select">
            <el-option value="en" label="English (en)"></el-option>
            <el-option value="zh-CN" label="简体中文 (zh-CN)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingAccount" @click="closeCreateAccountDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingAccount" @click="createAccount()" type="primary" size="small">Create account</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isListAccountDialogVisible" title="All accounts" width="600px">
      <div class="block">
        <div class="body full">
          <el-table :data="accounts" :show-header="false" class="data-table block-table">
            <el-table-column prop="name" label="ACCOUNT">
              <template slot-scope="scope">
                <a @click="viewAccount(scope.row)" href="javascript:;" class="primary">
                  <span>{{scope.row.name}} </span>

                  <el-tag v-if="isDefaultAccount(scope.row)" size="mini" type="info">Default</el-tag>
                </a>

              </template>
            </el-table-column>

            <el-table-column align="right" width="300">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <el-button @click="viewAccount(scope.row)" size="mini" plain>
                      View
                    </el-button>

                    <el-button v-if="!isDefaultAccount(scope.row)" @click="setAsDefault(scope.row)" size="mini" plain>
                      Set as Default
                    </el-button>

                    <el-button v-if="!isDefaultAccount(scope.row)" @click="openCloseAccountDialog(scope.row)" size="mini" plain>
                      Close Account
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeListAccountDialog()" plain size="small">Close</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isCloseAccountDialogVisible" title="Confirm Close Account" width="500px">
      <p>
        <el-alert
          :closable="false"
          title="Dangerous Action"
          type="error"
          description="Please read carefully before proceeding"
          >
        </el-alert>
      </p>

      <p>
        Are you sure you want to close this account?
        Once you close this account, you will no longer have access to it.

        <br/><br/>
        All resources under this account will be marked for deletion and will be
        permanently deleted in the next 3-5 days.

        <br/><br/>
        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isClosingAccount" @click="closeCloseAccountDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isClosingAccount" @click="closeAccount()" type="danger" size="small">Close Account</el-button>
      </div>
    </el-dialog>
  </div>
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

import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'
import withLiveMode from '@/helpers/with-live-mode'

export default {
  name: 'LeftNav',
  data () {
    return {
      isTogglingMode: false,

      accounts: [],
      totalCount: 0,
      allCount: 0,
      isListAccountDialogVisible: false,
      isLoadingAccountList: false,

      isCreateAccountDialogVisible: false,
      isCreatingAccount: false,
      accountDraft: { type: 'Account', name: 'Unamed Account', defaultLocale: 'en' },

      isCloseAccountDialogVisible: false,
      isClosingAccount: false,

      errors: {}
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'account')
    },

    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    },
    currentAccount () {
      if (this.$store.state.session.account) {
        return this.$store.state.session.account
      }

      return {}
    },
    user () {
      return this.$store.state.session.user
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
      if (routePath.startsWith('/team')) { return '/team' }

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
    isDefaultAccount (account) {
      return this.user.defaultAccount.id === account.id
    },

    can (action) {
      if (['owner'].includes(this.user.role)) {
        return true
      }

      switch (action) {
        case 'viewAccountSettings':
          return ['administrator'].includes(this.user.role)
        case 'viewTeam':
          return ['administrator'].includes(this.user.role)
        case 'viewDevelopment':
          return ['developer', 'administrator'].includes(this.user.role)
        case 'manageAccount':
          return ['standard'].includes(this.user.type)
        default:
          return false
      }
    },

    openListAccountDialog () {
      this.listAccount()
      this.isListAccountDialogVisible = true
    },

    closeListAccountDialog () {
      this.isListAccountDialogVisible = false
    },

    listAccount () {
      this.isLoadingAccountList = true

      return withLiveMode(() => {
        return freshcom.listAccount().then(response => {
          this.accounts = response.data
          this.allCount = response.meta.allCount
          this.totalCount = response.meta.totalCount

          this.isLoadingAccountList = false
        }).catch(errors => {
          this.isLoadingAccountList = false
        })
      })
    },

    viewAccount (account) {
      this.$store.dispatch('session/changeAccount', account.id).then(() => {
        this.closeListAccountDialog()

        this.$store.dispatch('pushRoute', { name: 'Home' })

        this.$message({
          showClose: true,
          message: `You are now viewing the Dashboard for ${account.name}`,
          type: 'success'
        })
      })
    },

    setAsDefault (account) {
      withLiveMode(() => {
        return freshcom.changeDefaultAccount({ id: account.id, type: 'Account' }).then((response) => {
          this.$message({
            showClose: true,
            message: `Default account changed successfully.`,
            type: 'success'
          })

          this.$store.dispatch('session/setUser', response.data)
        }).catch(response => {
          throw response
        })
      })
    },

    openCreateAccountDialog () {
      this.accountDraft = { type: 'Account', name: 'Unamed Account', defaultLocale: 'en' }
      this.isCreateAccountDialogVisible = true
    },

    closeCreateAccountDialog () {
      this.isCreateAccountDialogVisible = false
    },

    createAccount () {
      this.isCreatingAccount = true

      withLiveMode(() => {
        return freshcom.createAccount(this.accountDraft).then((response) => {
          this.$message({
            showClose: true,
            message: `Account created successfully.`,
            type: 'success'
          })

          this.isCreatingAccount = false
          this.closeCreateAccountDialog()
        }).catch(response => {
          this.errors = response.errors
          this.isCreatingAccount = false
          throw response
        })
      })
    },

    openCloseAccountDialog (targetAccount) {
      this.accountForClose = targetAccount
      this.isCloseAccountDialogVisible = true
    },

    closeCloseAccountDialog () {
      this.isCloseAccountDialogVisible = false
    },

    closeAccount () {
      this.isClosingAccount = true

      withLiveMode(() => {
        return freshcom.closeAccount(this.accountForClose.id).then(() => {
          return this.listAccount()
        }).then((response) => {
          let message = `Account closed successfully.`

          if (this.accountForClose.id === this.currentAccount.id ||
              this.accountForClose.testAccountId === this.currentAccount.id) {
            let defaultAccount = this.accounts.find((account) => {
              return this.isDefaultAccount(account)
            })

            message += ' You will be redirected to your default account in 3 seconds...'
            this.closeListAccountDialog()
            setTimeout(() => {
              this.viewAccount(defaultAccount)
            }, 3000)
          }

          this.$message({
            showClose: true,
            message: message,
            type: 'success'
          })

          this.isClosingAccount = false
          this.closeCloseAccountDialog()
        }).catch(response => {
          this.errors = response.errors
          this.isClosingAccount = false
          throw response
        })
      })
    },

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
