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
      <div slot="header">
        <el-row>
          <el-col :span="18">
            <el-button plain size="small"><icon name="filter" scale="0.7" class="v-middle"></icon> Filter</el-button>

            <div class="search">
              <el-input :value="searchKeyword" @input="updateSearchKeyword" size="small" placeholder="Search...">
                <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
              </el-input>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="text-right">
              <el-button @click="openAddDataImportDialog()" plain size="small">
                <icon name="plus" scale="0.7" class="v-middle"></icon> Import
              </el-button>
              <el-button @click="newCustomer()" plain size="small">
                <icon name="plus" scale="0.7" class="v-middle"></icon> New
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewCustomer" :data="customers"  class="full">
          <el-table-column prop="name" label="Customer">
            <template slot-scope="scope">
              <span v-if="scope.row.firstName || scope.row.lastName">
                {{scope.row.firstName}} {{scope.row.lastName}}
              </span>
              <span v-else>
                {{scope.row.otherName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="150">
            <template slot-scope="scope">
              {{$t(`fields.customer.status.${scope.row.status}`)}}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference" class="name-wrapper">
                  {{scope.row.id | idLastPart}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="Last updated" align="right" width="200">
            <template slot-scope="scope">
              {{scope.row.updatedAt | moment}}
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

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isAddingDataImport" title="Import customer" width="750px">
      <data-import-form v-model="dataImportDraftForAdd" :errors="errors"></data-import-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingDataImport" @click="closeAddDataImportDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingDataImport" @click="createDataImport()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import 'vue-awesome/icons/search'
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Pagination from '@/components/pagination'
import { idLastPart } from '@/helpers/filters'
import DataImportForm from '@/components/data-import-form'
import DataImport from '@/models/data-import'

export default {
  name: 'ListCustomer',
  components: {
    Pagination,
    DataImportForm
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
      resultCount: 0,

      isAddingDataImport: false,
      isCreatingDataImport: false,
      dataImportDraftForAdd: DataImport.objectWithDefaults(),

      errors: {}
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
      this.searchCustomer()
    },
    page (newPage, oldPage) {
      if (_.isEqual(newPage, oldPage)) {
        return
      }
      this.searchCustomer()
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

      freshcom.listCustomer({
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.customers = response.data
        this.totalCount = response.meta.totalCount
        this.resultCount = response.meta.resultCount

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    },

    viewCustomer (customer) {
      this.$store.dispatch('pushRoute', { name: 'ShowCustomer', params: { id: customer.id, callbackPath: this.currentRoutePath } })
    },

    newCustomer () {
      this.$store.dispatch('pushRoute', { name: 'NewCustomer' })
    },

    openAddDataImportDialog () {
      let dataImport = DataImport.objectWithDefaults()
      dataImport.dataType = 'Customer'

      this.dataImportDraftForAdd = dataImport
      this.isAddingDataImport = true
    },

    closeAddDataImportDialog () {
      this.isAddingDataImport = false
      this.isCreatingDataImport = false
    },

    createDataImport () {
      this.isCreatingDataImport = true

      freshcom.createDataImport(this.dataImportDraftForAdd).then(response => {
        this.$message({
          showClose: true,
          message: `Import started successfully.`,
          type: 'success'
        })

        this.closeAddDataImportDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingDataImport = false
        throw response
      })
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
