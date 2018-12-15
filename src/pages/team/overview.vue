<template>
<content-container :disable-test-banner="true" :ready="isReady">
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
        <div class="body">
          <dl>
            <dt>Account Handle</dt>
            <dd>{{account.handle}}</dd>

            <dt>Managed user sign-in link</dt>
            <dd>{{signinLink}}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import withLiveMode from '@/helpers/with-live-mode'
import { SIGNIN_DOMAIN, SIGNIN_SCHEME } from '@/env'
import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadAccount' })

export default {
  name: 'TeamOverview',
  mixins: [ResourcePageMixin],
  data () {
    return {
      isLoading: false,
      account: {}
    }
  },
  computed: {
    signinLink () {
      return `${SIGNIN_SCHEME}${this.account.handle}.${SIGNIN_DOMAIN}`
    }
  },
  methods: {
    loadAccount () {
      this.isLoading = true

      return withLiveMode(() => {
        return freshcom.retrieveAccount().then(response => {
          this.account = response.data

          this.isLoading = false
        }).catch(errors => {
          this.isLoading = false
          throw errors
        })
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
