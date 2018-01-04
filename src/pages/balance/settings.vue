<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/balance/settings" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ShowBalanceSettings' }" index="/balance/settings">Settings</el-menu-item>
    </el-menu>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        Billing Settings
      </div>

      <div class="data full">
        <p class="text-center">
          <a v-if="!balanceSettings.stripeUserId" :href="stripeAuthorizeUrl">Connect with Stripe</a>
          <span v-if="balanceSettings.stripeUserId">Stripe Connected</span>
        </p>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import BalanceSettings from '@/models/balance-settings'
import { STRIPE_TEST_CLIENT_ID, STRIPE_LIVE_CLIENT_ID, HOST_URL } from '@/env'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'ShowBalanceSettings',
  mixins: [PageMixin],
  props: ['stripeCode', 'stripeScope'],
  data () {
    return {
      balanceSettings: BalanceSettings.objectWithDefaults(),
      balanceSettingsDraft: BalanceSettings.objectWithDefaults(),
      isLoading: false
    }
  },
  created () {
    if (this.stripeCode) {
      this.balanceSettingsDraft.stripeAuthCode = this.stripeCode
      this.updateBalanceSettings()
    } else {
      this.loadBalanceSettings()
    }
  },
  computed: {
    stripeClientId () {
      if (this.isViewingTestData) {
        return STRIPE_TEST_CLIENT_ID
      } else {
        return STRIPE_LIVE_CLIENT_ID
      }
    },
    stripeAuthorizeUrl () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${this.stripeClientId}&scope=read_write&redirect_uri=${HOST_URL}/balance/settings`
    }
  },
  watch: {
    isViewingTestData () {
      this.loadBalanceSettings()
    }
  },
  methods: {
    updateBalanceSettings () {
      this.isLoading = true

      freshcom.updateBalanceSettings(this.balanceSettingsDraft).then(response => {
        this.balanceSettings = response.data
        this.balanceSettingsDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false

        let translatedErrors = translateErrors(response.errors, 'balanceSettings')
        this.$message({
          showClose: true,
          message: translatedErrors.stripeAuthCode,
          type: 'error'
        })

        throw response
      })
    },

    loadBalanceSettings () {
      this.isLoading = true
      freshcom.retrieveBalanceSettings().then(response => {
        this.balanceSettings = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-card .footer {
  text-align: right;
  border-top: 0;
}

.total {
  float: left;
  display: inline-block;
  font-size: 13px;
  min-width: 28px;
  height: 28px;
  line-height: 28px;
}

.dd {
  font-family: "Courier New";
}
</style>
