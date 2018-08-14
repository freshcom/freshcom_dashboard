<template>
<content-container disable-test-banner :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/users" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListUser' }" index="/users">
        Team
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <div class="brief">
      <div class="avatar">
        <icon name="id-card" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>User</span>
        </p>
        <h1>{{user.name}}</h1>
        <p class="id">{{user.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <el-button @click="changePassword()" size="small" plain>Change Password</el-button>
      <router-link :to="{ name: 'EditUser', params: { id: this.user.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{user.id}}</dd>

            <dt>Name</dt>
            <dd>{{user.name}}</dd>

            <dt>Username</dt>
            <dd>{{user.username}}</dd>

            <dt>Password</dt>
            <dd>
              ********
            </dd>

            <dt>Email</dt>
            <dd>{{user.email}}</dd>

            <dt>Role</dt>
            <dd>{{$t(`fields.accountMembership.role.${user.role}`)}}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteUser()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteUser" title="Delete user" width="500px" class="delete-user">
      <p>
        Are you sure you want to delete this user?
        <br/><br/>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingUser" @click="cancelDeleteUser()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingUser" @click="deleteUser()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isChangingPassword" title="Change password" width="400px">
      <el-form>
        <el-form @submit.native.prevent="updatePassword()" label-width="120px" size="small">
          <el-form-item :error="errorMsgs.value" label="New Password" required>
            <el-input v-model="password.value" id="password" type="password" placeholder="Enter a new password..."></el-input>
          </el-form-item>
        </el-form>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingPassword" @click="closeChangePasswordDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingPassword" @click="updatePassword()" type="primary" size="small" :disabled="!password.value">Change password</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import withLiveMode from '@/helpers/with-live-mode'
import translateErrors from '@/helpers/translate-errors'
import User from '@/models/user'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadUser' })

export default {
  name: 'ShowUser',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      user: User.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteUser: false,
      isDeletingUser: false,

      isChangingPassword: false,
      isUpdatingPassword: false,

      password: {},
      errors: {}
    }
  },
  created () {
    this.loadUser()
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'password')
    }
  },
  methods: {
    loadUser () {
      this.isLoading = true

      return withLiveMode(() => {
        return freshcom.retrieveUser(this.id).then(response => {
          this.user = response.data
          this.isLoading = false
        }).catch(errors => {
          this.isLoading = false
          throw errors
        })
      })
    },

    changePassword () {
      this.password = {
        type: 'Password',
        value: ''
      }
      this.errors = {}

      this.isChangingPassword = true
    },

    closeChangePasswordDialog () {
      this.isChangingPassword = false
    },

    updatePassword () {
      this.isUpdatingPassword = true

      withLiveMode(() => {
        return freshcom.updatePassword(this.user.id, this.password).then(() => {
          this.$message({
            showClose: true,
            message: `Password changed successfully.`,
            type: 'success'
          })

          this.isUpdatingPassword = false
          this.closeChangePasswordDialog()
        }).catch(response => {
          this.errors = response.errors
          this.isUpdatingPassword = false
          throw response
        })
      })
    },

    attemptDeleteUser () {
      this.isConfirmingDeleteUser = true
    },

    cancelDeleteUser () {
      this.isConfirmingDeleteUser = false
    },

    deleteUser () {
      this.isDeletingUser = true

      return withLiveMode(() => {
        return freshcom.deleteUser(this.user.id).then(() => {
          this.isDeletingUser = false

          this.$message({
            showClose: true,
            message: `User deleted successfully.`,
            type: 'success'
          })

          this.back()
        }).catch(() => {
          this.isDeletingUser = false
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
