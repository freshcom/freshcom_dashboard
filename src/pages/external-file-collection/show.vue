<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/file_collections" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief">
          <div class="avatar">
            <icon name="folder" class="avatar-icon"></icon>
          </div>

          <div class="detail">
            <p>{{record.code}}</p>
            <h2>{{record.name}}</h2>
            <p class="id">{{record.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editRecord()" size="medium">Edit</el-button>
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
              <dd>{{record.id}}</dd>

              <dt>Name</dt>
              <dd>{{record.name}}</dd>

              <dt>Label</dt>
              <dd>{{record.label}}</dd>
            </dl>
          </div>
        </div>

         <div class="block-title">
          <h3>Files</h3>
        </div>
        <div class="block">
          <div class="block-body full">
            <el-table :data="record.files" stripe class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>

              <el-table-column width="150">
                <template scope="scope">
                  <span>{{scope.row.contentType}}</span>
                </template>
              </el-table-column>

              <el-table-column width="120">
                <template scope="scope">
                  <span>{{scope.row.sizeBytes}} Bytes</span>
                </template>
              </el-table-column>

              <el-table-column width="200">
                <template scope="scope">
                  <span>{{scope.row.updatedAt | moment("MMM Do YYYY hh:mm:ss")}}</span>
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
              <dt v-if="record.product">Product</dt>
              <dd v-if="record.product">
                <router-link :to="{ name: 'ShowProduct', params: { id: record.product.id }}">
                  {{record.product.id}}
                </router-link>
              </dd>

              <dt v-if="record.stockable">Stockable</dt>
              <dd v-if="record.stockable">
                <router-link :to="{ name: 'ShowStockable', params: { id: record.stockable.id }}">
                  {{record.stockable.id}}
                </router-link>
              </dd>

              <dt v-if="record.unlockable">Unlockable</dt>
              <dd v-if="record.unlockable">
                <a href="#">{{record.unlockable.id}}</a>
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
        <delete-button @confirmed="deleteRecord" size="medium">Delete</delete-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/folder'

import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowExternalFileCollection',
  components: {
    DeleteButton
  },
  mixins: [ShowPage({ storeNamespace: 'externalFileCollection', name: 'File Collection', include: 'files' })],
  methods: {
    isImage (record) {
      return record.contentType.startsWith('image/')
    },
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditExternalFileCollection', params: { id: this.record.id } })
    },
    recordDeleted (record) {
      if (record.stockable) {
        this.$store.dispatch('stockable/resetRecord')
      }
      this.$store.dispatch('popRoute', 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
