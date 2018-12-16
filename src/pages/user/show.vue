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

            <dt>Username</dt>
            <dd>{{user.username}}</dd>

            <dt>Password</dt>
            <dd>
              <a @click="openChangePasswordDialog()" href="javascript:;" class="text-underline">
                (Change Password)
              </a>
            </dd>

            <dt>Password Reset Link</dt>
            <dd>
              <el-tooltip v-if="user.passwordResetToken" popper-class="tooltip-poppper-xl" effect="dark" :content="passwordResetLink" placement="top">
                <a :href="passwordResetLink" target="_blank">{{passwordResetLinkTeaser}} </a>
              </el-tooltip>
              <span v-else>None Generated </span>
              <small><a @click="openPasswordResetDialog()" href="javascript:;" class="text-underline">(Generate New Link)</a></small>
            </dd>

            <dt>Role</dt>
            <dd>
              <span>{{$t(`enums.user.role.${user.role}`)}} </span>
              <small>
                <a @click="openChangeRoleDialog()" href="javascript:;" class="text-underline">
                  (Change)
                </a>
              </small>
            </dd>

            <dt>Name</dt>
            <dd>{{user.name}}</dd>

            <dt>Email</dt>
            <dd>{{user.email}}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="openDeleteUserDialog()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isPasswordResetDialogVisible" title="Password Reset Link" width="500px">
      <p>
        Are you sure you want to generate a new password reset link for this user?

        <br/><br/>
        If this user have an email address, an email containing the link will also be
        sent to that email address.
      </p>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isGeneratingPasswordResetToken" @click="closePasswordResetDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isGeneratingPasswordResetToken" @click="generatePasswordResetToken()" type="primary" size="small">Generate</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isChangePasswordDialogVisible" title="Change password" width="400px">
      <el-form @submit.native.prevent="updatePassword()" label-width="120px" size="small">
        <el-form-item :error="errorMsgs.newPassword" label="New Password" required>
          <el-input v-model="password.newPassword" id="password" type="password" placeholder="Enter a new password..."></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingPassword" @click="closeChangePasswordDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingPassword" @click="updatePassword()" type="primary" size="small" :disabled="!password.newPassword">Change password</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isChangeRoleDialogVisible" title="Change Role" width="300px">
      <el-form @submit.native.prevent="updateRole()" label-width="50px" size="small">
        <el-form-item label="Role" required>
          <el-select v-model="roleDraft.value">
            <el-option v-for="role in roles" :key="role" :label="$t(`enums.user.role.${role}`)" :value="role"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingRole" @click="closeChangeRoleDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingRole" @click="updateRole()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isDeleteUserDialogVisible" title="Delete user" width="500px" class="delete-user">
      <p>
        Are you sure you want to delete this user?
        <br/><br/>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingUser" @click="closeDeleteUserDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingUser" @click="deleteUser()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import { ROLES, PASSWORD_RESET_ROOT_URL } from '@/env'
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
      roles: ROLES,
      user: User.objectWithDefaults(),
      isLoading: false,

      isPasswordResetDialogVisible: false,
      isGeneratingPasswordResetToken: false,

      isChangePasswordDialogVisible: false,
      isUpdatingPassword: false,

      roleDraft: {},
      isChangeRoleDialogVisible: false,
      isUpdatingRole: false,

      password: {},

      isDeleteUserDialogVisible: false,
      isDeletingUser: false,

      errors: {}
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'password')
    },

    passwordResetLink () {
      return `${PASSWORD_RESET_ROOT_URL}?token=${this.user.passwordResetToken}`
    },

    passwordResetLinkTeaser () {
      return `${PASSWORD_RESET_ROOT_URL}?tok...`
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

    openPasswordResetDialog () {
      this.isPasswordResetDialogVisible = true
    },

    closePasswordResetDialog () {
      this.isPasswordResetDialogVisible = false
    },

    generatePasswordResetToken () {
      withLiveMode(() => {
        return freshcom.generatePasswordResetToken({ id: this.user.id }).then((response) => {
          this.$message({
            showClose: true,
            message: `Password reset link generated successfully.`,
            type: 'success'
          })

          this.user = response.data
          this.isGeneratingPasswordResetToken = false
          this.closePasswordResetDialog()
        }).catch(response => {
          this.errors = response.errors
          this.isGeneratingPasswordResetToken = false
          throw response
        })
      })
    },

    openChangePasswordDialog () {
      this.password = {
        type: 'Password',
        newPassword: ''
      }
      this.errors = {}

      this.isChangePasswordDialogVisible = true
    },

    closeChangePasswordDialog () {
      this.isChangePasswordDialogVisible = false
    },

    updatePassword () {
      this.isUpdatingPassword = true

      withLiveMode(() => {
        return freshcom.changePassword({ id: this.user.id }, this.password).then(() => {
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

    openChangeRoleDialog () {
      this.isChangeRoleDialogVisible = true
      this.roleDraft = {
        id: this.user.id,
        type: 'Role',
        value: this.user.role
      }
    },

    closeChangeRoleDialog () {
      this.isChangeRoleDialogVisible = false
    },

    updateRole () {
      this.isUpdatingRole = true

      withLiveMode(() => {
        return freshcom.changeUserRole(this.roleDraft.id, this.roleDraft).then(response => {
          this.user.role = response.data.role
          this.$message({
            showClose: true,
            message: `Role changed successfully.`,
            type: 'success'
          })

          this.isUpdatingRole = false
          this.closeChangeRoleDialog()
        }).catch(errors => {
          this.isUpdatingRole = false
          throw errors
        })
      })
    },

    openDeleteUserDialog () {
      this.isDeleteUserDialogVisible = true
    },

    closeDeleteUserDialog () {
      this.isDeleteUserDialogVisible = false
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
