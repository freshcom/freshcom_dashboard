<template>
  <el-container class="content-container">
    <el-header height="60px">
      <div class="left-menu">
        <slot name="header"></slot>
      </div>

      <div class="right-menu">
        <locale-selector class="menu-item locale" @change="localeChangeHandler()"></locale-selector>

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

    <el-main>
      <el-card v-loading="!ready" class="main-card">
        <div v-if="ready" slot="header">
          <div v-if="isViewingTestData" class="test-data-banner">
            <div class="banner-content">TEST DATA</div>
          </div>

          <slot name="card-header"></slot>
        </div>
        <slot v-if="ready" name="card-content"></slot>
        <div v-if="!ready" class="spinner-holder"></div>
      </el-card>
    </el-main>

    <slot name="launchable"></slot>
  </el-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

export default {
  name: 'ContentContainer',
  props: {
    ready: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    user () {
      return this.$store.state.session.user
    },
    isViewingTestData () {
      return this.$store.state.session.mode === 'test'
    }
  },
  methods: {
    localeChangeHandler () {
      this.$emit('locale-changed')
    },
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
.spinner-holder {
  min-height: 600px;
}

.el-dropdown-menu .user-info {
  width: 120px;

  .name {
    margin: 0;
    color: #606266;
    font-size: 16px;
    line-height: 24px;
  }

  .role {
    margin: 0;
    color: #606266;
    line-height: 16px;
    font-size: 12px;
  }
}

.content-container {
  .left-menu {
    float: left;
    display: flex;
    align-items: flex-end;
    height: 30px;
  }

  .right-menu {
    float: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;

    .menu-item {
      margin-right: 16px;

      &:last-child {
        margin-right: 0px;
      }

      &.locale {
        margin-right: 24px;
      }

      .icon-wrapper {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 24px;
      }
    }
  }

  .el-header {
    padding: 20px 20px 10px 10px;
  }

  .el-main {
    padding: 0 20px 20px 5px;

    .test-data-banner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      border-top: 1px solid #f79a59;
      text-align: center;

      .banner-content {
        line-height: 9px;
        position: relative;
        vertical-align: top;
        display: inline-block;
        font-size: 10px;
        color: white;
        font-weight: 500;
        background-color: #f79a59;
        padding: 0px 10px 1px 10px;
        border: solid 1px #f79a59;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }
    }
  }
}

</style>

<style lang="scss">
// We have to use global here because that actual a tag
// is in the slot
.content-container .el-header .left-menu {
  a {
    &:first-child {
      margin-left: 0px;
    }

    &:hover {
      color: #409EFF;
    }

    &.router-link-active {
      color: #409EFF;
    }

    color: #909399;
    margin-left: 20px;
    font-weight: 500;
    font-size: 14px;
  }
}
</style>
