<template>
<content-container @locale-changed="listCustomer">
  <div slot="header">
    <router-link :to="{ name: 'ListCustomer'}">Customers</router-link>
  </div>

  <div slot="card-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="registered">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['guest', 'registered']" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="label" default="">
            <span slot="key">Label</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.label" type="text"></input>
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewCustomer' }" class="el-button el-button--small is-plain">
              <span class="with-icon">
                <span class="icon-wrapper">
                  <icon name="plus" scale="0.6"></icon>
                </span>
                <span>New</span>
              </span>
            </router-link>
            <el-button @click="openAddDataImportDialog()" plain size="small">
              <span class="with-icon">
                <span class="icon-wrapper">
                  <icon name="sign-in" scale="0.65"></icon>
                </span>
                <span>Import</span>
              </span>
            </el-button>
            <el-button plain size="small">
              <span class="with-icon">
                <span class="icon-wrapper">
                  <icon name="sign-out" scale="0.65"></icon>
                </span>
                <span>Export</span>
              </span>
            </el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
  </div>

  <div slot="card-content">
    <div class="data full">
      <query-result :is-loading="isLoading" :total-count="totalCount" :all-count="allCount" :page="page">
        <div slot="no-content">
          <p><icon name="user" scale="3"></icon></p>
          <p>
            <span>You haven't created any customer yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewCustomer' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first customer</span>
            </span>
          </router-link>
        </div>

        <el-table :data="customers" slot="content" class="data-table">
          <el-table-column prop="name" label="CUSTOMER">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowCustomer', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span v-if="scope.row.code">
                  [{{scope.row.code}}]
                </span>

                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowCustomer', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                <el-tag v-if="scope.row.status == 'registered'" :disable-transitions="true" size="mini">
                  {{$t(`fields.customer.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.customer.status.${scope.row.status}`)}}
                </el-tag>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference">
                  {{ scope.row.id | idLastPart }}
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column prop="updatedAt" label="UPDATED" align="right" width="200">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowCustomer', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                {{scope.row.updatedAt | moment}}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </query-result>
    </div>

    <div slot="launchable" class="launchable">
      <el-dialog :show-close="false" :visible="isAddingDataImport" title="Import customer" width="750px">
        <data-import-form v-model="dataImportDraftForAdd" :errors="errors"></data-import-form>

        <div slot="footer" class="dialog-footer">
          <el-button :disabled="isCreatingDataImport" @click="closeAddDataImportDialog()" plain size="small">Cancel</el-button>
          <el-button :loading="isCreatingDataImport" @click="createDataImport()" type="primary" size="small">Save</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import DataImportForm from '@/components/data-import-form'
import DataImport from '@/models/data-import'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listCustomer' })

export default {
  name: 'ListCustomer',
  mixins: [ListPageMixin],
  components: {
    DataImportForm
  },
  data () {
    return {
      customers: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0,

      isAddingDataImport: false,
      isCreatingDataImport: false,
      dataImportDraftForAdd: DataImport.objectWithDefaults(),

      errors: {}
    }
  },
  created () {
    this.listCustomer()
  },
  methods: {
    listCustomer () {
      this.isLoading = true

      freshcom.listCustomer({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.customers = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
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
