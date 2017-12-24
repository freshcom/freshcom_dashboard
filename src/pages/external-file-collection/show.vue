<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/file_collections" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListExternalFile' }" index="/files">
        Files
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">
        Collections
      </el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <div class="brief">
          <div class="avatar">
            <icon name="folder" class="avatar-icon"></icon>
          </div>

          <div class="detail">
            <p>{{efc.code}}</p>
            <h2>{{efc.name}}</h2>
            <p class="id">{{efc.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editEfc()" plain size="small">Edit</el-button>
        </div>
      </div>

      <div class="data">
        <div class="block-title">
          <h3>Details</h3>
        </div>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt>ID</dt>
              <dd>{{efc.id}}</dd>

              <dt>Name</dt>
              <dd>{{efc.name}}</dd>

              <dt>Label</dt>
              <dd>{{efc.label}}</dd>
            </dl>
          </div>
        </div>

         <div class="block-title">
          <h3>Files</h3>
        </div>
        <div class="block">
          <div class="block-body full">
            <el-table :data="efc.files" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>

              <el-table-column width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.contentType}}</span>
                </template>
              </el-table-column>

              <el-table-column width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.sizeBytes}} Bytes</span>
                </template>
              </el-table-column>

              <el-table-column width="200">
                <template slot-scope="scope">
                  <span>{{scope.row.updatedAt | moment}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <h3>Custom Data</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="efc.product">Product</dt>
              <dd v-if="efc.product">
                <router-link :to="{ name: 'ShowProduct', params: { id: efc.product.id }}">
                  {{efc.product.id}}
                </router-link>
              </dd>

              <dt v-if="efc.stockable">Stockable</dt>
              <dd v-if="efc.stockable">
                <router-link :to="{ name: 'ShowStockable', params: { id: efc.stockable.id }}">
                  {{efc.stockable.id}}
                </router-link>
              </dd>

              <dt v-if="efc.unlockable">Unlockable</dt>
              <dd v-if="efc.unlockable">
                <a href="#">{{efc.unlockable.id}}</a>
              </dd>
            </dl>
          </div>
        </div>

        <h3>Logs</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Events</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>
      </div>

      <div class="footer text-right">
        <confirm-button @confirmed="deleteEfc()" size="small">Delete</confirm-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/folder'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import ExternalFileCollection from '@/models/external-file-collection'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'ShowExternalFileCollection',
  mixins: [PageMixin],
  components: {
    ConfirmButton
  },
  props: ['id'],
  data () {
    return {
      efc: ExternalFileCollection.objectWithDefaults(),
      isLoading: false
    }
  },
  created () {
    this.loadEfc()
  },
  methods: {
    loadEfc () {
      this.isLoading = true

      freshcom.retrieveExternalFileCollection(this.id, {
        include: 'files'
      }).then(response => {
        this.efc = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },
    editEfc () {
      this.$store.dispatch('pushRoute', { name: 'EditExternalFileCollection', params: { id: this.efc.id } })
    },
    deleteEfc () {
      freshcom.deleteExternalFileCollection(this.efc.id).then(() => {
        this.$message({
          showClose: true,
          message: `File collection deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListExternalFileCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
