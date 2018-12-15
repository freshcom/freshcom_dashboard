<template>
<div id="forgot-password" class="page-wrapper">
  <div class="center">

    <h1>Freshcom</h1>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix text-center">
        <span>Reset your password</span>
      </div>

      <div v-if="isSubmitted">
        <el-alert :closable="false" type="success" title="">
          <p class="text-center">
          An email containing instructions to reset your password has been sent to
          your entered email.
          <br/>
          <br/>

          Please follow the instructions in the email to reset your password. If
          you cannot find the email in your inbox, please also check your spam folder.
          <br/>
          </p>

        </el-alert>
      </div>

      <div v-else>
        <p class="m-t-0">
          <el-alert
            v-if="notFound"
            :closable="false"
            title="The email your entered does not exist"
            type="error">
          </el-alert>
        </p>
        <p class="note">
          Enter your email below and we will send you instructions on
          how to reset it.
        </p>

        <el-form @submit.native.prevent="submit()" label-width="80px" size="small">
          <el-form-item label="Email" :error="errorMsgs.username">
            <el-input v-model="username"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button :loading="isSubmitting" type="primary" size="medium" native-type="submit">Send me instructions</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-card>

    <p class="pull-left"><router-link :to="{ name: 'Signin' }" >« Sign in</router-link></p>
    <p class="pull-right">
      Don't have an account? <router-link :to="{ name: 'Signup' }">Sign up</router-link>
    </p>
  </div>
</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'ForgotPassword',
  data () {
    return {
      username: '',
      isSubmitted: false,
      isSubmitting: false,
      notFound: false,
      errors: {}
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'passwordResetToken')
    }
  },
  methods: {
    submit (form) {
      this.notFound = false
      this.isSubmitting = true
      freshcom.generatePasswordResetToken({ username: this.username }).then(() => {
        this.isSubmitting = false
        this.isSubmitted = true
      }).catch(response => {
        this.errors = response.errors
        this.isSubmitting = false

        if (response.status === 404) {
          this.notFound = true
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
