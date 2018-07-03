<template>
<div id="register" class="page-wrapper">
  <div class="center">

    <h1>Freshcom</h1>

    <el-card shadow="never">
      <div slot="header" class="text-center">
        Create your Freshcom account
      </div>

      <el-form @submit.native.prevent="attemptLogin(form)" label-width="130px" size="small">
        <el-form-item label="Email">
          <el-input v-model="form.username" placeholder="Enter your email..."></el-input>
        </el-form-item>

        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="Enter your full name..."></el-input>
        </el-form-item>

        <el-form-item label="Password">
          <el-input v-model="form.password" id="password" type="password" placeholder="Enter your password..."></el-input>
        </el-form-item>

        <el-form-item label="Confirm Password">
          <el-input v-model="form.confirmPassword" id="confirm-password" type="password" placeholder="Enter your password again..."></el-input>
        </el-form-item>

        <el-form-item>
          <el-button :loading="isSubmitting" type="primary" native-type="submit" size="medium">Create your Freshcom account</el-button>
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
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'Register',
  data () {
    return {
      isSubmitting: false,
      form: {
        username: '',
        password: '',
        errors: {}
      }
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
    attemptLogin (form) {
      this.isSubmitting = true
      this.$store.dispatch('session/create', form).then(data => {
        this.isSubmitting = false
        let user = data[1]

        this.$message({
          showClose: true,
          message: `You are now logged in, welcome back ${user.firstName}!`,
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
