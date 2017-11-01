<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/payouts/settings" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ShowPayoutSettings' }" index="/payouts/settings">Settings</el-menu-item>
    </el-menu>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
        Payout Settings
      </div>

      <div class="data full">
        <a :href="stripeAuthorizeUrl">Connect with Stripe</a>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import { STRIPE_CLIENT_ID } from '@/env'

export default {
  name: 'ShowPayoutSettings',
  props: ['stripeCode', 'stripeScope'],
  created () {
    if (this.stripeCode) {
      this.$store.dispatch('account/updateRecord', { recordDraft: { stripeCode: this.stripeCode, type: 'Account' } })
    }
  },
  computed: {
    stripeAuthorizeUrl () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`
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
