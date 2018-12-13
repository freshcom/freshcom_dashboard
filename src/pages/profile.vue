<template>
<content-container :disable-test-banner="true">
  <div slot="content-body">
    <div class="data">
      <div class="block" style="margin-top: 0px;">
        <div class="header">
          <h2>Profile</h2>
        </div>

        <div class="body full">
          <el-row>
            <el-col :span="14" :offset="5">
              <el-form @submit.native.prevent="submit()" label-width="130px" size="small">
                <el-form-item v-if="user.type === 'managed'" label="Username">
                  <el-input v-model="user.username" id="username" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item :error="errorMsgs.email || errorMsgs.username" label="Email">
                  <el-input v-model="userDraft.email" id="email" placeholder="Enter your email..."></el-input>
                </el-form-item>

                <el-form-item :error="errorMsgs.name" label="Name">
                  <el-input v-model="userDraft.name" id="name" placeholder="Enter your full name..."></el-input>
                </el-form-item>

                <el-form-item label="">
                  <el-button @click="cancel()" plain size="small">
                    Cancel
                  </el-button>

                  <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
                    Save
                  </el-button>
                </el-form-item>

                <el-form-item label="Password">
                  <el-button @click="changePassword()" plain size="mini">Change password...</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isChangingPassword" title="Change password" width="500px">

      <el-form>
        <el-form @submit.native.prevent="updatePassword()" label-width="150px" size="small">
          <el-form-item :error="errorMsgs.currentPassword" label="Old Password">
            <el-input v-model="password.currentPassword" id="current-password" type="password" placeholder="Enter your current password..."></el-input>
          </el-form-item>

          <el-form-item :error="errorMsgs.newPassword" label="New Password">
            <el-input v-model="password.newPassword" id="password" type="password" placeholder="Enter a new password..."></el-input>
          </el-form-item>

          <el-form-item :error="errorMsgs.confirmPassword" label="Confirm Password">
            <el-input v-model="password.confirmPassword" id="confirm-password" type="password" placeholder="Enter the new password again..."></el-input>
          </el-form-item>
        </el-form>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingPassword" @click="closeChangePasswordDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingPassword" @click="updatePassword()" type="primary" size="small" :disabled="!password.newPassword">Change password</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'
import withLiveMode from '@/helpers/with-live-mode'

import ContentContainer from '@/components/content-container'

export default {
  name: 'ProfilePage',
  components: {
    ContentContainer
  },
  data () {
    return {
      isLoading: false,
      isChangingPassword: false,
      isUpdatingPassword: false,

      isUpdating: false,
      errors: {},
      userDraft: {},
      password: {
        type: 'User',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.session.user
    },
    errorMsgs () {
      return translateErrors(this.errors, 'user')
    }
  },
  created () {
    this.cancel()
  },
  methods: {
    changePassword () {
      this.password = {
        type: 'Password',
        currentPassword: '',
        password: '',
        confirmPassword: ''
      }
      this.errors = {}

      this.isChangingPassword = true
    },

    closeChangePasswordDialog () {
      this.isChangingPassword = false
    },

    cancel () {
      this.userDraft = {
        type: 'User',
        username: this.user.username,
        email: this.user.email,
        name: this.user.name
      }
    },

    updatePassword () {
      if (this.password.newPassword && this.password.newPassword !== this.password.confirmPassword) {
        this.errors = { confirmPassword: [{ code: 'notMatch' }] }
        return
      }

      this.isUpdatingPassword = true
      withLiveMode(() => {
        return freshcom.changePasswordById(this.user.id, this.password).then(() => {
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

    submit () {
      this.isUpdating = true
      if (this.user.type === 'standard') {
        this.userDraft.username = this.userDraft.email
      }

      withLiveMode(() => {
        return freshcom.updateUser(this.user.id, this.userDraft).then(response => {
          this.$message({
            showClose: true,
            message: `Profile saved successfully.`,
            type: 'success'
          })

          this.$store.dispatch('session/setUser', response.data)

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
