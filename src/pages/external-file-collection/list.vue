<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/file_collections" mode="horizontal">
        <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">Collections</el-menu-item>
      </el-menu>
      <locale-selector @change="search"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card class="main-card">
          <div slot="header" class="clearfix">
            <div class="search">
              <el-input :value="searchKeyword" @input="enteringKeyword" placeholder="Search...">
                <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
              </el-input>
            </div>

            <el-button @click="goTo({ name: 'NewExternalFileCollection' })" style="float: right;">
              <icon name="plus" scale="0.7" class="v-middle"></icon> New
            </el-button>
          </div>

          <div class="data full" v-loading="isLoading">
            <p v-if="noSearchResult" class="text-center">
              There is no result that matches "{{searchKeyword}}"
            </p>
            <p v-if="isEnteringSearchKeyword" class="text-center">
              Stop typing to search...
            </p>
            <el-table v-if="hasSearchResult" @row-click="viewRecord" :data="records" stripe class="full">
              <el-table-column prop="name" label="Name" width="200"></el-table-column>
              <el-table-column prop="label" label="Label" width="200"></el-table-column>
              <el-table-column prop="id" label="ID"></el-table-column>
            </el-table>

            <div v-if="hasSearchResult" class="footer">
              <span class="total">around {{resultCount}} results</span>
              <pagination :number="page.number" :size="page.size" :total="resultCount"></pagination>
            </div>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/chevron-left'

import Pagination from '@/components/pagination'
import DeleteButton from '@/components/delete-button'
import ListPage from '@/mixins/list-page'

export default {
  name: 'ListExternalFile',
  components: {
    Pagination,
    DeleteButton
  },
  mixins: [ListPage({ storeNamespace: 'externalFileCollection', fields: { 'Sku': 'name,label,contentType' } })],
  methods: {
    viewRecord (row) {
      this.goTo({ name: 'ShowExternalFileCollection', params: { id: row.id } })
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
</style>
