<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
    </el-menu>
    <locale-selector @change="search" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
        <el-button size="small"><icon name="filter" scale="0.7" class="v-middle"></icon> Filter</el-button>

        <div class="search">
          <el-input :value="searchKeyword" @input="enteringKeyword" size="small" placeholder="Search...">
            <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
          </el-input>
        </div>

        <el-button @click="goTo({ name: 'NewOrder' })" size="small" class="pull-right">
          <icon name="plus" scale="0.7" class="v-middle"></icon> New
        </el-button>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <p v-if="isEnteringSearchKeyword" class="search-notice text-center">
          Stop typing to search...
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewRecord" :data="tableData">
          <el-table-column prop="name" label="Order"></el-table-column>
          <el-table-column prop="status" label="Status" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 'opened'" size="mini" type="primary">
                {{$t(`attributes.order.status.${scope.row.status}`)}}
              </el-tag>
              <el-tag v-else type="gray">
                {{$t(`attributes.order.status.${scope.row.status}`)}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.idLastPart }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="openedAt" label="" align="right" width="130"></el-table-column>
        </el-table>

        <div v-if="hasSearchResult" class="footer">
          <span class="total">around {{resultCount}} results</span>
          <pagination :number="page.number" :size="page.size" :total="resultCount"></pagination>
        </div>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/chevron-left'

import _ from 'lodash'
import Pagination from '@/components/pagination'
import ListPage from '@/mixins/list-page'

export default {
  name: 'ListOrder',
  components: {
    Pagination
  },
  mixins: [ListPage({ storeNamespace: 'order', fields: { 'Order': 'code,name,status' } })],
  computed: {
    tableData () {
      return _.map(this.records, (record) => {
        let name = record.firstName + ' ' + record.lastName
        if (record.code) { name = `[${record.code}] ` + name }
        let idLastPart = _.last(record.id.split('-'))

        return {
          name: name,
          status: record.status,
          idLastPart: idLastPart,
          id: record.id,
          openedAt: this.$options.filters.moment(record.updatedAt, 'D MMM YYYY')
        }
      })
    }
  },
  methods: {
    viewRecord (row) {
      this.goTo({ name: 'ShowOrder', params: { id: row.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-card .footer {
  text-align: right;
  border-top: 0;
}

.total {
  float: left;
  display: inline-block;
  font-size: 13px;
  min-width: 28px;
  height: 28px;
  line-height: 28px;
}

.dd {
  font-family: "Courier New";
}
</style>
