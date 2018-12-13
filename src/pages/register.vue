<template>
<div id="register" class="page-wrapper">
  <div class="center">

    <h1>Freshcom</h1>

    <el-card shadow="never">
      <div slot="header" class="text-center">
        Create your Freshcom account
      </div>

      <el-form @submit.native.prevent="submit()" label-width="130px" size="small">
        <el-form-item :error="errorMsgs.email || errorMsgs.username" label="Email">
          <el-input v-model="userDraft.email" id="email" placeholder="Enter your email..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.name" label="Name">
          <el-input v-model="userDraft.name" id="name" placeholder="Enter your full name..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.password" label="Password">
          <el-input v-model="userDraft.password" id="password" type="password" placeholder="Enter your password..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.confirmPassword" label="Confirm Password">
          <el-input v-model="userDraft.confirmPassword" id="confirm-password" type="password" placeholder="Enter your password again..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.defaultLocale" label="Default Locale">
          <el-select v-model="userDraft.defaultLocale" placeholder="Please select">
            <el-option value="en" label="English (en)"></el-option>
            <el-option value="zh-CN" label="简体中文 (zh-CN)"></el-option>
          </el-select>

          <el-popover placement="top" title="Default Locale" width="300" trigger="hover">
            <p>
              Default locale is the locale that will be used when you create a resource,
              once a resource is created you will then be able to update it in unlimited
              number of locales.
            </p>

            <p>
              This does not effect the UI, currently Freshcom Dashboard is only
              available in English.
            </p>

            <span slot="reference" class="m-l-10">
              <icon name="regular/question-circle" class="v-middle"></icon>
            </span>
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-button :loading="isCreating" type="primary" native-type="submit" size="medium">Create your Freshcom account</el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <p class="text-center">
      Already have an account? <router-link :to="{ name: 'Signin' }" >Log in</router-link>
    </p>
  </div>
</div>
</template>

<script>
import 'vue-awesome/icons/regular/question-circle'

import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'Register',
  data () {
    return {
      isCreating: false,
      userDraft: {
        type: 'User',
        username: '',
        email: '',
        name: '',
        defaultLocale: 'en',
        password: '',
        confirmPassword: ''
      },
      errors: {}
    }
  },
  created () {
    if (this.isLoggedIn) {
      this.$store.dispatch('pushRoute', { name: 'Home' })
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.session.user
    },
    errorMsgs () {
      return translateErrors(this.errors, 'user')
    }
  },
  methods: {
    submit () {
      if (this.userDraft.password && this.userDraft.password !== this.userDraft.confirmPassword) {
        this.errors = { confirmPassword: [{ code: 'notMatch' }] }
        return
      }

      this.isCreating = true

      this.userDraft.username = this.userDraft.email
      freshcom.createUser(this.userDraft).then(() => {
        return this.$store.dispatch('session/create', { username: this.userDraft.username, password: this.userDraft.password })
      }).then(response => {
        this.$message({
          showClose: true,
          message: `Sign up successful, you are now logged in.`,
          type: 'success'
        })

        this.isCreating = false
        this.$store.dispatch('pushRoute', { name: 'Home' })
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.page-wrapper#register {
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
  width: 500px;
}
</style>
