<template>

<div class="primary-search component-wrapper">
  <el-input placeholder="Search..." class="search-input">
    <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
  </el-input>
</div>

</template>

<script>
import 'vue-awesome/icons/search'

export default {
  name: 'PrimarySearch'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search-input {
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}

.component-wrapper {
  display: inline-block;
  margin-left: 35px;
  width: 500px;
}
</style>

<style lang="scss">
.primary-search .search-input input, .primary-search .search-input .el-input-group__prepend {
  border: none;
}
</style>
