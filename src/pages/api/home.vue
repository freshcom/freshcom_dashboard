<template>
<content-container :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/api" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'APIHome' }" index="/api">
        API
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block detail">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>Account ID</dt>
            <dd v-if="isViewingTestData">{{account.testAccountId}}</dd>
            <dd v-else>{{account.id}}</dd>

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
import freshcom from '@/freshcom-sdk'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadRefreshToken' })

export default {
  name: 'APIHome',
  mixins: [ResourcePageMixin],
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

    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    }
  },
  watch: {
    isViewingTestData () {
      this.loadRefreshToken()
    }
  },
  methods: {
    loadRefreshToken () {
      this.isLoading = true
      return freshcom.retrieveRefreshToken().then(response => {
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
.detail dl dt {
  width: 200px;
}
</style>
