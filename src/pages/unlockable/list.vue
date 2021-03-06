<template>
<content-container @locale-changed="listUnlockable">
  <div slot="header">
    <el-menu :router="true" default-active="/unlockables" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">
        Unlockables
      </el-menu-item>
    </el-menu>
  </div>

  <div v-if="allCount > 0" slot="content-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="active">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['active', 'draft']" :key="status" :value="status">is {{status}}</option>
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
                <input v-model="filterObjectDraft.label" type="text">
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewUnlockable' }" class="el-button el-button--small is-plain">
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
                  <icon name="sign-in-alt" scale="0.65"></icon>
                </span>
                <span>Import</span>
              </span>
            </el-button>
            <el-button plain size="small">
              <span class="with-icon">
                <span class="icon-wrapper">
                  <icon name="sign-out-alt" scale="0.65"></icon>
                </span>
                <span>Export</span>
              </span>
            </el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
  </div>

  <div slot="content-body">
    <div class="data full">
      <query-result :is-loading="isLoading" :total-count="totalCount" :all-count="allCount" :page="page">
        <div slot="no-content">
          <p><icon name="unlock-alt" scale="3"></icon></p>
          <p>
            <span>You haven't created any unlockable yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewUnlockable' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first unlockable</span>
            </span>
          </router-link>
        </div>

        <el-table :data="unlockables" slot="content">
          <el-table-column prop="name" label="UNLOCKABLE">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.id } }" class="primary">
                <span v-if="scope.row.code">
                  [{{scope.row.code}}]
                </span>

                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.id } }">
                <el-tag v-if="scope.row.status == 'active'" :disable-transitions="true" size="mini">
                  {{$t(`enums.unlockable.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`enums.unlockable.status.${scope.row.status}`)}}
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
              <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.id } }">
                {{scope.row.updatedAt | moment}}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </query-result>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isAddingDataImport" title="Import unlockable" width="750px">
      <data-import-form v-model="dataImportDraftForAdd" :errors="errors"></data-import-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingDataImport" @click="closeAddDataImportDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingDataImport" @click="createDataImport()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import DataImportForm from '@/components/data-import-form'
import DataImport from '@/models/data-import'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listUnlockable' })

export default {
  name: 'ListUnlockable',
  mixins: [ListPageMixin],
  components: {
    DataImportForm
  },
  data () {
    return {
      unlockables: [],
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
    this.listUnlockable()
  },
  methods: {
    listUnlockable () {
      this.isLoading = true

      freshcom.listUnlockable({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.unlockables = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
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
<style scoped lang="scss">

</style>
