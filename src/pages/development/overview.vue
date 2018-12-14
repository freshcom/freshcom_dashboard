<template>
<content-container :ready="isReady">
  <div slot="content-body">
    <div class="data">
      <div class="block detail" style="margin-top: 0px;">
        <div class="header">
          <h2>API Credentials</h2>
        </div>

        <div class="body">
          <dl>
            <dt>Account ID</dt>
            <dd>{{account.prefixedId}}</dd>

            <dt>Publishable Refresh Token</dt>
            <dd>{{refreshToken.prefixedId}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Apps</h2>

          <div class="action-group">
            <el-button size="mini" plain>
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="apps" class="data-table block-table">
            <el-table-column label="NAME" width="300">
              <template slot-scope="scope">
                <a href="javascript:;" class="primary">
                  {{scope.row.name}}
                </a>
              </template>
            </el-table-column>

            <el-table-column label="APP ID">
              <template slot-scope="scope">
                {{scope.row.prefixedId}}
              </template>
            </el-table-column>

            <el-table-column label="CREATED" width="200">
              <template slot-scope="scope">
                {{scope.row.insertedAt | moment}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'load' })

export default {
  name: 'DevelopmentOverview',
  mixins: [ResourcePageMixin],
  data () {
    return {
      isLoading: false,
      refreshToken: {},
      apps: []
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
      this.load()
    }
  },
  methods: {
    load () {
      this.isLoading = true

      return Promise.all([this.loadRefreshToken(), this.listApp()]).then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },

    loadRefreshToken () {
      return freshcom.retrieveRefreshToken().then(response => {
        this.refreshToken = response.data
      })
    },

    listApp () {
      return freshcom.listApp().then(response => {
        this.apps = response.data
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
