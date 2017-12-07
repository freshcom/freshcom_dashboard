<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/billing/settings" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ShowBillingSettings' }" index="/billing/settings">Settings</el-menu-item>
    </el-menu>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
        Billing Settings
      </div>

      <div class="data full">
        <p class="text-center">
          <a v-if="!billingSettings.stripeUserId" :href="stripeAuthorizeUrl">Connect with Stripe</a>
          <span v-if="billingSettings.stripeUserId">Stripe Connected</span>
        </p>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import BillingSettings from '@/models/billing-settings'
import { STRIPE_CLIENT_ID } from '@/env'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'ShowBillingSettings',
  props: ['stripeCode', 'stripeScope'],
  data () {
    return {
      billingSettings: BillingSettings.objectWithDefaults(),
      billingSettingsDraft: BillingSettings.objectWithDefaults(),
      isLoading: false
    }
  },
  created () {
    if (this.stripeCode) {
      this.billingSettingsDraft.stripeAuthCode = this.stripeCode
      this.updateBillingSettings()
    } else {
      this.loadBillingSettings()
    }
  },
  computed: {
    stripeAuthorizeUrl () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`
    }
  },
  methods: {
    updateBillingSettings () {
      this.isLoading = true

      freshcom.updateBillingSettings(this.billingSettingsDraft).then(response => {
        this.billingSettings = response.data
        this.billingSettingsDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false

        let translatedErrors = translateErrors(response.errors, 'billingSettings')
        this.$message({
          showClose: true,
          message: translatedErrors.stripeAuthCode,
          type: 'error'
        })

        throw response
      })
    },

    loadBillingSettings () {
      this.isLoading = true
      freshcom.retrieveBillingSettings().then(response => {
        this.billingSettings = response.data
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
