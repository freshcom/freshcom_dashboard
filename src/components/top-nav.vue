<template>
  <el-header height="60px">
    <div class="left-menu">
      <slot></slot>
    </div>

    <div class="right-menu">
      <locale-selector class="menu-item locale"></locale-selector>

      <div class="menu-item">
        <div class="icon-wrapper">
          <icon name="book" scale="1.2"></icon>
        </div>
      </div>

      <el-dropdown class="menu-item" trigger="click">
        <div class="icon-wrapper">
          <icon name="bell" scale="1.1"></icon>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>Notification</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown class="menu-item" trigger="click" @command="userDropdownHandler">
        <div class="icon-wrapper">
          <icon name="user-circle-o" scale="1.5"></icon>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="true" class="user-info">
            <p class="name">{{user.name}}</p>
            <p class="role">Administrator</p>
          </el-dropdown-item>
          <el-dropdown-item command="nuke" divided>Nuke</el-dropdown-item>
          <el-dropdown-item command="logout">Log out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

]
<script>
export default {
  name: 'TopNav',
  computed: {
    user () {
      return this.$store.state.session.user
    }
  },
  methods: {
    userDropdownHandler (item) {
      if (item === 'logout') {
        this.$store.dispatch('session/reset')
        this.$store.dispatch('pushRoute', { name: 'Login' })
      }

      if (item === 'nuke') {
        freshcom.createAccountReset({ type: 'AccountReset' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
