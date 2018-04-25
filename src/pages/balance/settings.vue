<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListPayment' }">Payments</router-link>
    <router-link :to="{ name: 'ShowBalanceSettings' }">Settings</router-link>
  </div>

  <div slot="card-header">
    Settings
  </div>

  <div slot="card-content">
    <div v-loading="isLoading" class="data">
      <div v-if="isReady" class="block">
        <div class="header">
          <h2>Stripe</h2>

          <div v-if="balanceSettings.stripeUserId" class="action-group">
            <el-button @click="disconnect()" plain size="mini">
              Disconnect
            </el-button>
          </div>
        </div>

        <div class="body">
          <template v-if="balanceSettings.stripeUserId">
            <dl>
              <dt>User ID</dt>
              <dd>{{balanceSettings.stripeUserId}}</dd>
            </dl>

            <dl>
              <dt>Publishable Key</dt>
              <dd>{{balanceSettings.stripePublishableKey}}</dd>
            </dl>
          </template>

          <template v-else>
            <p class="text-center">
              You have no connected Stripe account.
            </p>

            <p class="text-center">
              <a :href="stripeAuthorizeUrl" class="el-button el-button--mini is-plain">
                Connect Now
              </a>
            </p>
          </template>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
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
      isReady: false,
      isLoading: false
    }
  },
  created () {
    if (this.stripeCode) {
      this.connect().then(() => {
        this.isReady = true
      })
    } else {
      this.loadBalanceSettings().then(() => {
        this.isReady = true
      })
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
    disconnect () {
      this.isLoading = true

      return freshcom.updateBalanceSettings({ stripeUserId: null }).then(response => {
        this.balanceSettings = response.data

        this.$message({
          showClose: true,
          message: `Stripe account disconnected successfully.`,
          type: 'success'
        })

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
      })
    },

    connect () {
      this.isLoading = true

      return freshcom.updateBalanceSettings({ stripeAuthCode: this.stripeCode }).then(response => {
        this.balanceSettings = response.data

        this.$message({
          showClose: true,
          message: `Stripe account connected successfully.`,
          type: 'success'
        })

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
      return freshcom.retrieveBalanceSettings().then(response => {
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
</style>
