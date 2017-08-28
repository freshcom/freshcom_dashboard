<template>

<el-dropdown trigger="click" @command="setResourceLocale" class="locale-selector">
  <span class="el-dropdown-link">
    {{resourceLocale}} <i class="el-icon-caret-bottom el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item command="en">English (en)</el-dropdown-item>
    <el-dropdown-item command="zh-CN">简体中文 (zh-CN)</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
</template>

<script>
export default {
  name: 'LocaleSelector',
  props: {
    beforeChange: {
      type: Function,
      default () {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      }
    }
  },
  computed: {
    resourceLocale () {
      let localeText = {
        'en': 'English (en)',
        'zh-CN': '简体中文 (zh-CN)'
      }
      return localeText[this.$store.state.resourceLocale]
    }
  },
  methods: {
    setResourceLocale (locale) {
      if (locale === this.resourceLocale) {
        return
      }

      this.beforeChange(locale, this.resourceLocale).then((result) => {
        if (!result) {
          return
        }

        this.$store.dispatch('setResourceLocale', locale)
        this.$emit('change')
      })
    }
  }
}
</script>

<style scoped>
.el-dropdown {
  line-height: 35px;
  cursor: pointer
}
</style>
