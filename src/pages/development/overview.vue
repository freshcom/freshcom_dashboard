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
            <el-button @click="openAddAppDialog()" size="mini" plain>
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="apps" class="data-table block-table">
            <el-table-column label="NAME">
              <template slot-scope="scope">
                <a href="javascript:;" class="primary">
                  {{scope.row.name}}
                </a>
              </template>
            </el-table-column>

            <el-table-column label="APP ID" width="360">
              <template slot-scope="scope">
                {{scope.row.prefixedId}}
              </template>
            </el-table-column>

            <el-table-column label="CREATED" width="170">
              <template slot-scope="scope">
                {{scope.row.insertedAt | moment}}
              </template>
            </el-table-column>

            <el-table-column align="right" width="130">
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <el-button size="mini" plain>
                      Edit
                    </el-button>

                    <el-button @click="openDeleteAppDialog(scope.row)" size="mini" plain>
                      Delete
                    </el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isAddAppDialogVisible" title="Add App" width="500px">
      <el-form @submit.native.prevent="addApp()" label-width="120px" size="small">
        <el-form-item :error="errorMsgs.name" label="Name" required>
          <el-input v-model="appDraft.name" id="name" type="text" placeholder="Enter a name..."></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :disabled="isAddingApp" @click="closeAddAppDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isAddingApp" @click="addApp()" type="primary" size="small">Add</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isDeleteAppDialogVisible" title="Delete App" width="600px">
      <p>
      <el-alert
        :closable="false"
        title="Dangerous Action"
        type="error"
        description="Please read carefully before proceeding"
        >
      </el-alert>
      </p>

      <p>
        Are you sure you want to delete this app?
        Any application that are using this app's App ID
        will immediately lose all access to Freshcom API.

        <br/><br/>
        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingApp" @click="closeDeleteAppDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingApp" @click="deleteApp()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'load' })

export default {
  name: 'DevelopmentOverview',
  mixins: [ResourcePageMixin],
  data () {
    return {
      isLoading: false,
      refreshToken: {},
      apps: [],

      appDraft: { name: '', type: 'App' },
      isAddAppDialogVisible: false,
      isAddingApp: false,
      errors: {},

      isDeleteAppDialogVisible: false,
      isDeletingApp: false,
      appForDelete: {}
    }
  },
  computed: {
    account () {
      return this.$store.state.session.account
    },

    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    },

    errorMsgs () {
      return translateErrors(this.errors, 'password')
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
    },

    openAddAppDialog () {
      this.isAddAppDialogVisible = true
    },

    closeAddAppDialog () {
      this.isAddAppDialogVisible = false
      this.errors = {}
      this.appDraft = { type: 'App', name: '' }
    },

    addApp () {
      this.isAddingApp = true

      return freshcom.addApp(this.appDraft).then(() => {
        return this.listApp()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `New app added successfully.`,
          type: 'success'
        })

        this.isAddingApp = false
        this.closeAddAppDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isAddingApp = false
        this.closeAddAppDialog()
        throw response
      })
    },

    openDeleteAppDialog (targetApp) {
      this.appForDelete = targetApp
      this.isDeleteAppDialogVisible = true
    },

    closeDeleteAppDialog () {
      this.isDeleteAppDialogVisible = false
    },

    deleteApp () {
      this.isDeletingApp = true

      return freshcom.deleteApp(this.appForDelete.id).then(() => {
        return this.listApp()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `App deleted successfully.`,
          type: 'success'
        })

        this.isDeletingApp = false
        this.closeDeleteAppDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isDeletingApp = false
        this.closeDeleteAppDialog()
        throw response
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.detail dl dt {
  width: 200px;
}
</style>
