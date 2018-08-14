<template>
<content-container :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/users" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListUser' }" index="/users">
        Team
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Edit user</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form @submit.native.prevent="submit()" label-width="140px" size="small">
            <user-fieldset v-model="userDraft" :errors="errors"></user-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'
import withLiveMode from '@/helpers/with-live-mode'

import User from '@/models/user'
import UserFieldset from '@/components/user-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadUser' })

export default {
  name: 'EditUser',
  mixins: [ResourcePageMixin],
  components: {
    UserFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      user: User.objectWithDefaults(),
      userDraft: User.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      this.isLoading = true

      return withLiveMode(() => {
        return freshcom.retrieveUser(this.id).then(response => {
          this.user = response.data
          this.userDraft = _.cloneDeep(response.data)

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
        return freshcom.updateUser(
          this.userDraft.id,
          this.userDraft
        ).then(user => {
          this.$message({
            showClose: true,
            message: `User saved successfully.`,
            type: 'success'
          })

          this.isUpdating = false
          this.back()
        }).catch(response => {
          this.errors = response.errors
          this.isUpdating = false
          throw response
        })
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowUser', params: { id: this.user.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
