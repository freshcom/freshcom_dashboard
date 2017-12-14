<template>
<div class="main-col">
  <div>
    <el-menu :router="true" default-active="/unlockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">Unlockables</el-menu-item>
    </el-menu>
    <locale-selector @change="searchUnlockable()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <el-row>
          <el-col :span="18">
            <el-button plain size="small">
              <icon name="filter" scale="0.7" class="v-middle"></icon> Filter
            </el-button>
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
              <el-button @click="newUnlockable()" plain size="small" class="pull-right" >
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
        <el-table v-if="hasSearchResult" @row-click="viewUnlockable" :data="unlockables" class="full">
          <el-table-column prop="name" label="Unlockable">
            <template slot-scope="scope">
              <span v-if="scope.row.code">
                [{{scope.row.code}}]
              </span>
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="100">
            <template slot-scope="scope">
              {{$t(`fields.unlockable.status.${scope.row.status}`)}}
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
          <el-table-column prop="updatedAt" label="" align="right" width="200">
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
    <el-dialog :show-close="false" :visible="isAddingDataImport" title="Import unlockable" width="750px">
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

import PageMixin from '@/mixins/page'
import Pagination from '@/components/pagination'
import { idLastPart } from '@/helpers/filters'
import DataImportForm from '@/components/data-import-form'
import DataImport from '@/models/data-import'

export default {
  name: 'ListUnlockable',
  mixins: [PageMixin],
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
      unlockables: [],
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
    this.searchUnlockable()
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
    isViewingTestData () {
      this.searchUnlockable()
    },
    searchKeyword (newKeyword) {
      this.searchUnlockable()
    },
    page (newPage, oldPage) {
      if (_.isEqual(newPage, oldPage)) {
        return
      }
      this.searchUnlockable()
    }
  },
  methods: {
    updateSearchKeyword: _.debounce(function (newSearchKeyword) {
      // Remove page[number] from query to reset to the first page
      let q = _.merge({}, _.omit(this.$route.query, ['page[number]']), { search: newSearchKeyword })
      this.$router.replace({ name: this.$store.state.route.name, query: q })
    }, 300),
    searchUnlockable () {
      this.isLoading = true

      freshcom.listUnlockable({
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.unlockables = response.data
        this.totalCount = response.meta.totalCount
        this.resultCount = response.meta.resultCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
    },
    viewUnlockable (depositable) {
      this.$store.dispatch('pushRoute', { name: 'ShowUnlockable', params: { id: depositable.id, callbackPath: this.currentRoutePath } })
    },
    newUnlockable () {
      this.$store.dispatch('pushRoute', { name: 'NewUnlockable' })
    },

    openAddDataImportDialog () {
      let dataImport = DataImport.objectWithDefaults()
      dataImport.dataType = 'Unlockable'

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
