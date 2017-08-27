<template>
<div id="home" class="page-wrapper">
  <div class="left-col">
    <left-nav></left-nav>
  </div>

  <div class="main-col">
    <div class="content">
      <div class="controls">
        <div class="search">
          <el-input placeholder="Search..." class="search-input">
            <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LeftNav from '@/components/left-nav'

import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/filter'

import 'vue-awesome/icons/search'

export default {
  name: 'Home',
  components: {
    LeftNav
  },
  data () {
    return {
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.left-col {
  float: left;
  width: 200px;
}

</style>
