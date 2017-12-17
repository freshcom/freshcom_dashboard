<template>
<div id="login" class="page-wrapper">
  <div class="center">

    <h1>Freshcom</h1>

    <el-card class="box-card">
      <div slot="header" class="clearfix text-center">
        <span>Please login to continue</span>
      </div>

      <el-form :model="form" label-width="80px" size="small">
        <el-form-item label="Email">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>

        <el-form-item class="thin">
          <el-checkbox v-model="form.rememberMe">Remember me</el-checkbox>
          <a href="#" class="pull-right">Forgot your password?</a>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="medium" @click="attemptLogin(form)">Login to your account</el-button>
        </el-form-item>

      </el-form>
    </el-card>

    <p class="text-center">Don't have an account? <a href="#">Sign up</a></p>
  </div>
</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: '',
        rememberMe: false
      }
    }
  },
  methods: {
    attemptLogin (form) {
      this.$store.dispatch('session/create', form).then(data => {
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
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.page-wrapper#login {
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
  width: 420px;
}
</style>
