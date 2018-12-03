<template>
<content-container>
  <div slot="header">
    <el-menu :router="true" default-active="/team" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'TeamOverview' }" index="/team">
        Overview
      </el-menu-item>

      <el-menu-item :route="{ name: 'ListUser' }" index="/users">
        Users
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block detail" style="margin-top: 0px;">
        <div class="header">
          <h2>Lala</h2>
        </div>

        <div class="body">
          <dl>
            <dt>Managed user sign-in link</dt>
            <dd>{{signinLink}}</dd>

            <dl>
              <dt>Publishable Refresh Token</dt>
              <dd>{{refreshToken.prefixedId}}</dd>
            </dl>
          </dl>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
import { SIGNIN_DOMAIN, SIGNIN_SCHEME } from '@/env'
import PageMixin from '@/mixins/page'

export default {
  name: 'TeamOverview',
  mixins: [PageMixin],
  data () {
    return {
      isLoading: false,
      refreshToken: {}
    }
  },
  computed: {
    account () {
      return this.$store.state.session.account
    },
    signinLink () {
      return `${SIGNIN_SCHEME}${this.account.handle}.${SIGNIN_DOMAIN}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.detail dl dt {
  width: 200px;
}
</style>
