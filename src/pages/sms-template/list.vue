<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/sms-templates" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListSms' }" index="/sms">SMS</el-menu-item>
      <el-menu-item :route="{ name: 'ListSmsTemplate' }" index="/sms-templates">Templates</el-menu-item>
    </el-menu>
    <locale-selector @change="searchSmsTemplate" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <el-button plain size="small"><icon name="filter" scale="0.7" class="v-middle"></icon> Filter</el-button>

        <div class="search">
          <el-input :value="searchKeyword" @input="updateSearchKeyword" size="small" placeholder="Search...">
            <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
          </el-input>
        </div>

        <el-button @click="newSmsTemplate()" plain size="small" class="pull-right">
          <icon name="plus" scale="0.7" class="v-middle"></icon> New
        </el-button>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewSmsTemplate" :data="smsTemplates">
          <el-table-column prop="name" label="Name">
          </el-table-column>

          <el-table-column prop="updatedAt" label="" align="right" width="200">
            <template slot-scope="scope">
              {{scope.row.updatedAt | moment}}
            </template>
          </el-table-column>
        </el-table>

        <div v-if="hasSearchResult" class="footer">
          <span class="total">around {{totalCount}} results</span>
          <pagination :number="page.number" :size="page.size" :total="totalCount"></pagination>
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

import PageMixin from '@/mixins/page'
import Pagination from '@/components/pagination'
import { dollar, idLastPart } from '@/helpers/filters'

export default {
  name: 'ListSms',
  mixins: [PageMixin],
  components: {
    Pagination
  },
  filters: {
    dollar,
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
      smsTemplates: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.searchSmsTemplate()
  },
  computed: {
    noSearchResult () {
      return !this.isLoading && this.totalCount === 0 && this.allCount > 0
    },
    hasSearchResult () {
      return !this.isLoading && this.totalCount !== 0
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  watch: {
    isViewingTestData () {
      this.searchSmsTemplate()
    },
    searchKeyword (newKeyword) {
      this.searchSmsTemplate()
    },
    page (newPage, oldPage) {
      if (_.isEqual(newPage, oldPage)) {
        return
      }
      this.search()
    }
  },
  methods: {
    updateSearchKeyword: _.debounce(function (newSearchKeyword) {
      // Remove page[number] from query to reset to the first page
      let q = _.merge({}, _.omit(this.$route.query, ['page[number]']), { search: newSearchKeyword })
      this.$router.replace({ name: this.$store.state.route.name, query: q })
    }, 300),
    searchSmsTemplate () {
      this.isLoading = true

      freshcom.listSmsTemplate({
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.smsTemplates = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    },
    viewSmsTemplate (smsTemplate) {
      this.$store.dispatch('pushRoute', { name: 'ShowSmsTemplate', params: { id: smsTemplate.id, callbackPath: this.currentRoutePath } })
    },
    newSmsTemplate () {
      this.$store.dispatch('pushRoute', { name: 'NewSmsTemplate' })
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
