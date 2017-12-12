<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/api" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'APIHome' }" index="/api">API</el-menu-item>
    </el-menu>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
        API
      </div>

      <div class="data">
        <div class="block-title">
          <h3>Details</h3>
        </div>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt>Account ID</dt>
              <dd>{{account.id}}</dd>
            </dl>

            <dl>
              <dt>Publishable Refresh Token</dt>
              <dd>{{refreshToken.id}}</dd>
            </dl>
          </div>
        </div>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'

export default {
  name: 'APIHome',
  data () {
    return {
      isLoading: false,
      refreshToken: {}
    }
  },
  computed: {
    account () {
      return this.$store.state.session.account
    }
  },
  created () {
    this.loadRefreshToken()
  },
  methods: {
    loadRefreshToken () {
      this.isLoading = true
      freshcom.retrieveRefreshToken().then(response => {
        this.refreshToken = response.data
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
.main-card dl dt {
  width: 200px;
}
</style>
