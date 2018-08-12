<template>
  <el-container class="content-container">
    <el-header>
      <div class="top-nav clearfix">
        <div class="left-menu">
          <slot name="header"></slot>
        </div>

        <div class="right-menu">
          <el-menu mode="horizontal">
            <el-submenu index="locale">
              <template slot="title">{{$t(`locales.${resourceLocale}`)}}</template>
              <el-menu-item @click="setResourceLocale('en')" index="en">
                English (en)
              </el-menu-item>
              <el-menu-item @click="setResourceLocale('zh-CN')" index="zh-CN">
                简体中文 (zh-CN)
              </el-menu-item>
            </el-submenu>

            <el-submenu index="user">
              <template slot="title">{{user.name}}</template>
              <el-menu-item @click="nuke()" index="nuke">Nuke</el-menu-item>
              <el-menu-item @click="profile()" index="logout">Profile</el-menu-item>
              <el-menu-item @click="logout()" index="logout">Log Out</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>

        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>
      </div>
    </el-header>

    <el-main>
      <div v-loading="!ready" class="content">
        <div v-if="ready" class="content-header">
          <slot name="content-header"></slot>
        </div>

        <div v-if="ready" class="content-body">
          <slot name="content-body"></slot>
        </div>

        <div v-if="!ready" class="spinner-holder"></div>
      </div>
    </el-main>

    <slot name="launchable"></slot>
  </el-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

export default {
  name: 'ContentContainer',
  props: {
    disableTestBanner: {
      type: Boolean,
      default: false
    },
    ready: {
      type: Boolean,
      default: true
    },
    localeBeforeChange: {
      type: Function,
      default () {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.session.user
    },
    isViewingTestData () {
      if (this.disableTestBanner) {
        return false
      } else {
        return this.$store.state.session.mode === 'test'
      }
    },
    resourceLocale () {
      return this.$store.state.resourceLocale
    }
  },
  methods: {
    setResourceLocale (locale) {
      if (locale === this.resourceLocale) {
        return
      }

      this.localeBeforeChange(locale, this.resourceLocale).then((result) => {
        if (!result) {
          return
        }

        this.$store.dispatch('setResourceLocale', locale)
        this.$emit('locale-changed')
      })
    },

    profile () {
      this.$store.dispatch('pushRoute', { name: 'Profile' })
    },

    nuke () {
      freshcom.createAccountReset({ type: 'AccountReset' })
    },

    logout () {
      this.$store.dispatch('session/reset')
      this.$store.dispatch('pushRoute', { name: 'Login' })
    }
  }
}
</script>

<style lang="scss">
.content-container {
  .el-main {
    padding: 10px;
  }

  .el-header {
    padding: 0px;
  }

  .top-nav {
    border-bottom: solid 1px #e6e6e6;
    position: relative;

    ul {
      border-bottom: none;
    }

    .left-menu {
      float: left;
    }

    .right-menu {
      float: right;

      .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
        border-bottom: 0px;
      }
    }
  }

  .content-header {
    padding: 10px 10px 0px 10px;

    h1 {
      display: inline-block;
      line-height: 32px;
      margin: 0px;
      font-weight: 400;
      font-size: 16px;
      width: 450px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .spinner-holder {
    min-height: 600px;
  }

  .test-data-banner {
    height: 0px;
    z-index: 100;
    position: absolute;
    left: 0;
    top: 60px;
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
</style>
