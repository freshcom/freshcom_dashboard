<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/point_deposits" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListPointDeposit' }" index="/point_deposits">Point Deposits</el-menu-item>
    </el-menu>
    <locale-selector @change="searchPointDeposit()" class="pull-right"></locale-selector>
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

        <el-button @click="newPointDeposit()" plain size="small" class="pull-right">
          <icon name="plus" scale="0.7" class="v-middle"></icon> New
        </el-button>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewPointDeposit" :data="pointDeposits">
          <el-table-column prop="name" label="Point Deposit">
            <template slot-scope="scope">
              <span v-if="scope.row.code">
                [{{scope.row.code}}]
              </span>
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amout" label="Amount" width="100">
            <template slot-scope="scope">
              {{scope.row.amount}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="100">
            <template slot-scope="scope">
              {{$t(`attributes.pointDeposit.status.${scope.row.status}`)}}
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
          <el-table-column prop="insertedAt" label="" align="right" width="200">
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
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/chevron-left'

import _ from 'lodash'
import Pagination from '@/components/pagination'
import { dollar, idLastPart } from '@/helpers/filters'

export default {
  name: 'ListPointDeposit',
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
      pointDeposits: [],
      isLoading: false,
      totalCount: 0,
      resultCount: 0
    }
  },
  created () {
    this.searchPointDeposit()
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
      this.searchPointDeposit()
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
    searchPointDeposit () {
      this.isLoading = true

      this.$store.dispatch('pointDeposit/listPointDeposit', {
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.pointDeposits = response.pointDeposits
        this.totalCount = response.meta.totalCount
        this.resultCount = response.meta.resultCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
    },
    viewPointDeposit (pointDeposit) {
      this.$store.dispatch('pushRoute', { name: 'ShowPointDeposit', params: { id: pointDeposit.id, callbackPath: this.currentRoutePath } })
    },
    newPointDeposit () {
      this.$store.dispatch('pushRoute', { name: 'NewPointDeposit' })
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
