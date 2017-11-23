<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/customers" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListCustomer' }" index="/customers">Customers</el-menu-item>
    </el-menu>
    <locale-selector @change="searchCustomer()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
        <el-button size="small"><icon name="filter" scale="0.7" class="v-middle"></icon> Filter</el-button>
        <div class="search">
          <el-input :value="searchKeyword" @input="updateSearchKeyword" size="small" placeholder="Search...">
            <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
          </el-input>
        </div>

        <el-button @click="goTo({ name: 'NewCustomer' })" size="small" class="pull-right">
          <icon name="plus" scale="0.7" class="v-middle"></icon> New
        </el-button>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewCustomer" :data="customers" stripe class="full">
          <el-table-column prop="name" label="Customer">
            <template slot-scope="scope">
              {{scope.row.firstName}} {{scope.row.lastName}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="150">
            <template slot-scope="scope">
              {{$t(`attributes.customer.status.${scope.row.status}`)}}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.id | idLastPart }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="Created At" align="right" width="200">
            <template slot-scope="scope">
              {{scope.row.insertedAt | moment}}
            </template>
          </el-table-column>
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
import Pagination from '@/components/pagination'
import { idLastPart } from '@/helpers/filters'

export default {
  name: 'ListCustomer',
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
      customers: [],
      isLoading: false,
      totalCount: 0,
      resultCount: 0
    }
  },
  created () {
    this.searchCustomer()
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
      this.searchOrder()
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
    searchCustomer () {
      this.isLoading = true

      this.$store.dispatch('customer/listCustomer', {
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.customers = response.customers
        this.totalCount = response.meta.totalCount
        this.resultCount = response.meta.resultCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
    },
    viewCustomer (customer) {
      this.$store.dispatch('pushRoute', { name: 'ShowCustomer', params: { id: customer.id, callbackPath: this.currentRoutePath } })
    },
    newCustomer () {
      this.$store.dispatch('pushRoute', { name: 'NewCustomer' })
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
