<template>
<content-container disable-test-banner>
  <div slot="header">
    <el-menu :router="true" default-active="/users" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListUser' }" index="/users">
        Team
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Create a managed user</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="100px" size="small">
            <user-fieldset v-model="userDraft" :errors="errors"></user-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import UserFieldset from '@/components/user-fieldset'
import User from '@/models/user'
import withLiveMode from '@/helpers/with-live-mode'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewUser',
  mixins: [PageMixin],
  components: {
    UserFieldset
  },
  data () {
    return {
      userDraft: User.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      withLiveMode(() => {
        return freshcom.createUser(this.userDraft).then(response => {
          this.$message({
            showClose: true,
            message: `User created successfully.`,
            type: 'success'
          })

          this.isCreating = false
          this.back()
        }).catch(response => {
          this.errors = response.errors
          this.isCreating = false
          throw response
        })
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListUser' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
