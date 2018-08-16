<template>
<div id="reset-password" class="page-wrapper">
  <div class="center">

    <h1>Freshcom</h1>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix text-center">
        <span>Set a new password</span>
      </div>

      <div v-if="isSubmitted">
        <el-alert :closable="false" type="success" title="" class="text-center">
          <p>
            Your new password has been set successfully.
          </p>

          <p>
            <router-link :to="{ name: 'Login' }">Log in now »</router-link>
          </p>
        </el-alert>
      </div>

      <div v-else>
        <el-alert
          v-if="!isResetTokenValid"
          :closable="false"
          title="This password reset link has expired"
          description="Please go to the forget password page to request a new link"
          type="error">
        </el-alert>

        <el-form @submit.native.prevent="submit()" label-width="130px" size="small">
          <el-form-item label="New Password" :error="errorMsgs.value">
            <el-input v-model="newPassword" type="password"></el-input>
          </el-form-item>

          <el-form-item label="Confirm Password" :error="errorMsgs.confirmPassword">
            <el-input v-model="confirmPassword" type="password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button :loading="isSubmitting" :disabled="!newPassword" type="primary" size="medium" native-type="submit">Save my new password</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <p class="pull-left" v-if="!isSubmitted"><router-link :to="{ name: 'Login' }" >« Log in</router-link></p>
    <p class="pull-right">
      Don't have an account? <router-link :to="{ name: 'Register' }">Sign up</router-link>
    </p>
  </div>
</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'ResetPassword',
  props: ['resetToken'],
  data () {
    return {
      username: '',
      isSubmitted: false,
      isSubmitting: false,
      newPassword: '',
      confirmPassword: '',
      isResetTokenValid: true,
      errors: {}
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'password')
    }
  },
  methods: {
    submit (form) {
      if (this.newPassword && this.newPassword !== this.confirmPassword) {
        this.errors = { confirmPassword: [{ code: 'notMatch' }] }
        return
      }

      this.isSubmitting = true
      freshcom.resetPassword({
        resetToken: this.resetToken,
        type: 'Password',
        value: this.newPassword
      }).then(() => {
        this.isSubmitting = false
        this.isSubmitted = true
      }).catch(response => {
        this.errors = response.errors
        this.isSubmitting = false

        if (response.status === 422) {
          this.isResetTokenValid = false
        }

        throw response
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.page-wrapper#forgot-password {
  margin-top: 50px;
}

h1 {
  text-align: center;
}

p.note {
  margin: 0 50px 0 50px;
  text-align: center;
  font-size: 14px;
}

.center {
  margin: auto;
  width: 420px;
}
</style>
