<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/files" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListExternalFile' }" index="/files">
        Files
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">
        Collections
      </el-menu-item>
    </el-menu>
    <locale-selector @change="searchExternalFile()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
        <div class="search">
          <el-input :value="searchKeyword" @input="updateSearchKeyword" placeholder="Search..." size="small">
            <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
          </el-input>
        </div>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewExternalFile" :data="externalFiles" class="full">
          <el-table-column prop="name" label="Name" width="300"></el-table-column>
          <el-table-column prop="contentType" label="Content Type" width="150"></el-table-column>
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
</template>

<script>
import 'vue-awesome/icons/search'

import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Pagination from '@/components/pagination'
import { idLastPart } from '@/helpers/filters'

export default {
  name: 'ListExternalFile',
  components: {
    Pagination
  },
  filters: {
    idLastPart
  },
  props: {
    searchKeyword: {
      type: String,
      default: ''
    },
    page: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      externalFiles: [],
      isLoading: false,
      totalCount: 0,
      resultCount: 0,

      errors: {}
    }
  },
  created () {
    this.searchExternalFile()
  },
  computed: {
    noSearchResult () {
      return !this.isLoading && this.resultCount === 0 && this.totalCount > 0
    },
    hasSearchResult () {
      return !this.isLoading && this.resultCount !== 0
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  watch: {
    searchKeyword (newKeyword) {
      this.searchExternalFile()
    },
    page (newPage, oldPage) {
      if (_.isEqual(newPage, oldPage)) {
        return
      }
      this.searchExternalFile()
    }
  },
  methods: {
    updateSearchKeyword: _.debounce(function (newSearchKeyword) {
      let q = _.merge({}, _.omit(this.$route.query, ['page[number]']), { search: newSearchKeyword })
      this.$router.replace({ name: this.$store.state.route.name, query: q })
    }, 300),

    searchExternalFile () {
      this.isLoading = true

      freshcom.listExternalFile({
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.externalFiles = response.data
        this.totalCount = response.meta.totalCount
        this.resultCount = response.meta.resultCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
    },

    viewExternalFile (externalFile) {
      this.$store.dispatch('pushRoute', { name: 'ShowExternalFile', params: { id: externalFile.id, callbackPath: this.currentRoutePath } })
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
