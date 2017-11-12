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
        <p class="text-center">
          <a v-if="!account.stripeUserId" :href="stripeAuthorizeUrl">Connect with Stripe</a>
          <span v-if="account.stripeUserId">Stripe Connected</span>
        </p>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import { STRIPE_CLIENT_ID } from '@/env'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'ShowPayoutSettings',
  props: ['stripeCode', 'stripeScope'],
  created () {
    if (this.stripeCode) {
      this.$store.dispatch('stripeAccount/createRecord', {
        authCode: this.stripeCode, type: 'StripeAccount'
      }).catch(errors => {
        let errorCode = errors.authCode[0]
        this.$message({
          showClose: true,
          message: this.$t(errorI18nKey('account', 'authCode', errorCode)),
          type: 'error'
        })
      })
    }
  },
  computed: {
    account () {
      return this.$store.state.stripeAccount.record
    },
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
