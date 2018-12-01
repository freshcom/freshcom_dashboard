<template>
<content-container>
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
            <el-button @click="back()" plain size="small">
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
import AccountFieldset from '@/components/account-fieldset'
import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory()

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
      accountDraft: {},
      errors: {}
    }
  },
  computed: {
    account () {
      return this.$store.state.session.account
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
