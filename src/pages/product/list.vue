<template>
<content-container @locale-changed="listProduct">
  <div slot="header">
    <el-menu :router="true" default-active="/products" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
        Products
      </el-menu-item>

      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product-collections">
        Collections
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

          <filter-condition v-model="filterObjectDraft" filter-key="collectionId" default="">
            <span slot="key">Collection ID</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.collectionId" type="text">
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewProduct' }" class="el-button el-button--small is-plain">
              <span class="with-icon">
                <span class="icon-wrapper">
                  <icon name="plus" scale="0.6"></icon>
                </span>
                <span>New</span>
              </span>
            </router-link>

            <el-button @click="addDataImport()" plain size="small">
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
          <p><icon name="tag" scale="3"></icon></p>
          <p>
            <span>You haven't created any product yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewProduct' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first product</span>
            </span>
          </router-link>

          <el-button @click="addDataImport()" plain size="small">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="sign-in-alt" scale="0.65"></icon>
              </span>
              <span>Import products</span>
            </span>
          </el-button>
        </div>

        <el-table :data="products" slot="content">
          <el-table-column prop="name" label="PRODUCT">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span v-if="scope.row.code">
                  [{{scope.row.code}}]
                </span>

                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <hover-button v-show="scope.row.status === 'active'" @click="deactivateProduct(scope.row)" type="primary" hover-type="info">
                <span slot="normal">{{$t(`fields.product.status.${scope.row.status}`)}}</span>
                <span slot="hover">Deactive</span>
              </hover-button>

              <hover-button v-show="scope.row.status !== 'active'" @click="activateProduct(scope.row)" type="info" hover-type="primary">
                <span slot="normal">{{$t(`fields.product.status.${scope.row.status}`)}}</span>
                <span slot="hover">Activate</span>
              </hover-button>
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
              <router-link :to="{ name: 'ShowProduct', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                {{scope.row.updatedAt | moment}}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </query-result>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isAddingDataImport" title="Import data" width="500px">
      <el-form @submit.native.prevent="createDataImport()" label-width="100px" size="small">
        <data-import-fieldset v-model="dataImportForAdd" :data-types="['Product', 'Price']" :errors="errors"></data-import-fieldset>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingDataImport" @click="cancelAddDataImport()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingDataImport" @click="createDataImport()" type="primary" size="small">Start Import</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import HoverButton from '@/components/hover-button'
import DataImportFieldset from '@/components/data-import-fieldset'
import DataImport from '@/models/data-import'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listProduct' })

export default {
  name: 'ListProduct',
  mixins: [ListPageMixin],
  components: {
    DataImportFieldset,
    HoverButton
  },
  data () {
    return {
      products: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0,

      isAddingDataImport: false,
      isCreatingDataImport: false,
      dataImportForAdd: DataImport.objectWithDefaults(),

      errors: {}
    }
  },
  created () {
    this.listProduct()
  },
  methods: {
    listProduct () {
      this.isLoading = true

      freshcom.listProduct({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.products = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
    },

    addDataImport () {
      let dataImport = DataImport.objectWithDefaults()
      dataImport.dataType = 'Product'

      this.dataImportForAdd = dataImport
      this.isAddingDataImport = true
    },

    cancelAddDataImport () {
      this.isAddingDataImport = false
    },

    createDataImport () {
      this.isCreatingDataImport = true

      freshcom.createDataImport(this.dataImportForAdd).then(response => {
        this.$message({
          showClose: true,
          message: `Import started successfully.`,
          type: 'success'
        })

        this.isCreatingDataImport = false
        this.cancelAddDataImport()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingDataImport = false
        throw response
      })
    },

    deactivateProduct (product) {
      let productDraft = _.cloneDeep(product)
      productDraft.status = 'draft'

      freshcom.updateProduct(product.id, productDraft).then(() => {
        product.status = 'draft'
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product deactivated successfully.`,
          type: 'success'
        })
      })
    },

    activateProduct (product) {
      let productDraft = _.cloneDeep(product)
      productDraft.status = 'active'

      freshcom.updateProduct(product.id, productDraft).then(() => {
        product.status = 'active'
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Product activated successfully.`,
          type: 'success'
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
