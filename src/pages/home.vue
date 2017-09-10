<template>
<div id="home" class="main-col">
  <div class="content">

    <div class="controls">
      <primary-search></primary-search>
    </div>

    <div class="secondary-nav">
      <el-menu mode="horizontal">
        <el-menu-item index="1">Products</el-menu-item>
        <el-menu-item index="2">Collections</el-menu-item>
      </el-menu>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card class="main-card">
          <div slot="header" class="clearfix">
            <el-button size="small"><icon name="filter" scale="0.7" class="v-middle"></icon> Filter</el-button>

            <el-button style="float: right;" size="small"><icon name="plus" scale="0.7" class="v-middle"></icon> New</el-button>
          </div>
          <el-table
            :data="tableData3"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import LeftNav from '@/components/left-nav'
import PrimarySearch from '@/components/primary-search'

import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/filter'

import 'vue-awesome/icons/search'

export default {
  name: 'Home',
  components: {
    LeftNav,
    PrimarySearch
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
</style>
