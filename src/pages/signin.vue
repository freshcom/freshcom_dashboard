<template>
<div id="signin" class="page-wrapper">
  <div class="center">

    <h1>Freshcom</h1>

    <el-card shadow="never">
      <div slot="header" class="text-center">
        Please sign in to continue
      </div>

      <el-form @submit.native.prevent="signin(form)" label-position="top" size="small">
        <el-form-item v-if="isTypeChangeable" label="Sign in as" style="margin-top: 10px;">
          <el-radio-group v-model="form.type" @input="resetForm()">
            <el-radio-button label="standard">Standard User</el-radio-button>
            <el-radio-button label="managed">Managed User</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.type === 'managed'" label="Account ID or Account Handle">
          <div slot="label">
            <el-tooltip popper-class="tooltip-poppper-md" effect="dark" content="A 36-characters account ID provided by your administrator" placement="left">
              <span class="text-underline">Account ID</span>
            </el-tooltip>
            <span> or </span>
            <el-tooltip popper-class="tooltip-poppper-md" effect="dark" content="A friendly account identifier from your administrator that includes alphanumeric characters or dashes" placement="right">
              <span class="text-underline">Account Handle</span>
            </el-tooltip>
          </div>
          <el-input v-model="form.account" id="account"></el-input>
        </el-form-item>

        <el-form-item>
          <span slot="label" v-if="form.type === 'standard'">Email</span>
          <span v-else>Username</span>
          <el-input v-model="form.username" id="username"></el-input>
        </el-form-item>

        <el-form-item label="Password">
          <el-input v-model="form.password" id="password" type="password"></el-input>
        </el-form-item>

        <el-form-item class="thin">
          <el-checkbox v-model="form.rememberMe">Remember me</el-checkbox>
          <router-link :to="{ name: 'ForgotPassword'} " class="pull-right">Forgot your password?</router-link>
        </el-form-item>

        <el-form-item style="margin-bottom: 10px;">
          <el-button :loading="isSubmitting" type="primary" native-type="submit" size="medium">Sign in to your account</el-button>
        </el-form-item>

        <small v-if="!isTypeChangeable" class="text-underline">
          <router-link :to="{ name: 'Signin' }" >Sign in using standard user credentials</router-link>
        </small>
      </el-form>
    </el-card>

    <p class="text-center">New to Freshcom?<br/><router-link :to="{ name: 'Register' }" >Create a new Freshcom account</router-link></p>
  </div>
</div>
</template>

<script>
export default {
  name: 'Signin',
  props: ['account'],
  data () {
    return {
      isTypeChangeable: true,
      isSubmitting: false,
      form: {
        type: 'standard',
        account: '',
        username: '',
        password: '',
        rememberMe: false
      }
    }
  },
  created () {
    if (this.isLoggedIn) {
      this.$store.dispatch('pushRoute', { name: 'Home' })
    }

    if (this.account) {
      this.form.type = 'managed'
      this.isTypeChangeable = false
      this.form.account = this.account
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (!to.query.account) {
      this.isTypeChangeable = true
      this.form.type = 'standard'
      this.form.account = ''
    }

    next()
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.session.user
    }
  },
  methods: {
    resetForm () {
      this.form.username = ''
      this.form.password = ''
      this.form.account = ''
    },

    signin (form) {
      this.isSubmitting = true
      this.$store.dispatch('session/create', form).then(() => {
        this.isSubmitting = false

        this.$message({
          showClose: true,
          message: `You are now logged in, welcome back!`,
          type: 'success'
        })

        this.$store.dispatch('pushRoute', { name: 'Home' })
      }).catch(response => {
        this.$message({
          showClose: true,
          message: response.error_description,
          type: 'error'
        })

        this.isSubmitting = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.page-wrapper#signin {
  margin-top: 50px;
}

h1 {
  text-align: center;
}

.thin {
  margin-top: -10px;
  margin-bottom: 10px;
}

.center {
  margin: auto;
  width: 360px;
}
</style>
