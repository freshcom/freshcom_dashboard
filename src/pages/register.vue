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
          <el-input v-model="userDraft.email" placeholder="Enter your email..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.name" label="Name">
          <el-input v-model="userDraft.name" placeholder="Enter your full name..."></el-input>
        </el-form-item>

        <el-form-item :error="errorMsgs.password" label="Password">
          <el-input v-model="userDraft.password" id="password" type="password" placeholder="Enter your password..."></el-input>
        </el-form-item>

        <el-form-item label="Confirm Password">
          <el-input v-model="userDraft.confirmPassword" id="confirm-password" type="password" placeholder="Enter your password again..."></el-input>
        </el-form-item>

        <el-form-item>
          <el-button :loading="isCreating" type="primary" native-type="submit" size="medium">Create your Freshcom account</el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <p class="text-center">
      Already have an account? <router-link :to="{ name: 'Login' }" >Log in</router-link>
    </p>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
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
      this.isCreating = true

      this.userDraft.username = this.userDraft.email
      freshcom.createUser(this.userDraft).then(() => {

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
