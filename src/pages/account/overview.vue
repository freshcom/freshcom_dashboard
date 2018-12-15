<template>
<content-container :disable-test-banner="true" :ready="isReady">
  <div slot="content-body">
    <div class="data">
      <div class="block" style="margin-top: 0px;">
        <div class="header">
          <h2>Account Settings</h2>
        </div>

        <div class="body full">
          <el-row>
            <el-col :span="16" :offset="4">
              <el-form @submit.native.prevent="submit()" label-width="140px" size="small">
                <account-fieldset v-model="accountDraft" :errors="errors"></account-fieldset>
              </el-form>
            </el-col>
          </el-row>

          <div class="foot text-right">
            <el-button @click="reset()" plain size="small">
              Cancel
            </el-button>

            <el-button @click="submit()" type="primary" size="small">
              Save
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'
import withLiveMode from '@/helpers/with-live-mode'
import AccountFieldset from '@/components/account-fieldset'
import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadAccount' })

export default {
  name: 'AccountOverview',
  mixins: [ResourcePageMixin],
  components: {
    AccountFieldset
  },
  created () {
    this.accountDraft = _.cloneDeep(this.account)
  },
  data () {
    return {
      account: {},
      accountDraft: {},
      errors: {},
      isUpdating: false
    }
  },
  computed: {
    mode () {
      return this.$store.state.session.mode
    }
  },
  methods: {
    reset () {
      this.accountDraft = _.cloneDeep(this.account)
    },

    loadAccount () {
      this.isLoading = true

      return withLiveMode(() => {
        return freshcom.retrieveAccount().then(response => {
          this.account = response.data
          this.accountDraft = _.cloneDeep(this.account)

          this.isLoading = false
        }).catch(errors => {
          this.isLoading = false
          throw errors
        })
      })
    },

    submit () {
      this.isUpdating = true

      return withLiveMode(() => {
        return freshcom.updateCurrentAccount(this.accountDraft).then(response => {
          this.$message({
            showClose: true,
            message: `Account updated successfully.`,
            type: 'success'
          })

          this.account = response.data
          if (this.mode === 'live') {
            this.$store.dispatch('session/setAccount', this.account)
          }

          this.isUpdating = false
        }).catch(response => {
          this.errors = response.errors
          this.isUpdating = false
          throw response
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
