<template>
<div class="top-nav clearfix">
  <el-menu mode="horizontal">
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-submenu index="2">
      <template slot="title">我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
      <el-submenu index="2-4">
        <template slot="title">选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
        <el-menu-item index="2-4-2">选项2</el-menu-item>
        <el-menu-item index="2-4-3">选项3</el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</div>
</template>

<script>
export default {
  name: 'TopNav',
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.top-nav {
  border-bottom: solid 1px #e6e6e6;
}

.top-nav ul {
  float: right;
  border-bottom: none;
}
</style>
