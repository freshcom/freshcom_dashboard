<template>
<div class="page-warpper">
  <div>
    <el-menu :router="true" default-active="file_collections" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListExternalFile' }" index="files">Files</el-menu-item>
      <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="file_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a File Collection</span>

        <div class="pull-right">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button @click="submit(recordDraft)" type="primary" size="medium">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <external-file-collection-form v-model="recordDraft" :errors="errors"></external-file-collection-form>
      </div>

      <div class="footer">
        <el-button @click="cancel" plain size="medium">
          Cancel
        </el-button>

        <el-button @click="submit(recordDraft)" type="primary" class="pull-right" size="medium">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import ExternalFileCollectionForm from '@/components/external-file-collection-form'
import NewPage from '@/mixins/new-page'

export default {
  name: 'NewExternalFileCollection',
  components: {
    ExternalFileCollectionForm
  },
  mixins: [NewPage({ storeNamespace: 'externalFileCollection', name: 'File Collection' })],
  props: ['skuId', 'productId', 'unlockableId'],
  created () {
    if (this.skuId) {
      let record = _.cloneDeep(this.record)
      record.owner = { id: this.skuId, type: 'Sku' }
      this.$store.dispatch('externalFileCollection/setRecord', record)
      return
    }

    if (this.productId) {
      let record = _.cloneDeep(this.record)
      record.owner = { id: this.productId, type: 'Product' }
      this.$store.dispatch('externalFileCollection/setRecord', record)
    }
  },
  methods: {
    recordCreated (record) {
      if (this.skuId) {
        this.$store.dispatch('sku/resetRecord')
      }

      if (this.productId) {
        this.$store.dispatch('product/resetRecord')
      }

      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      this.$store.dispatch('pushRoute', { name: 'ShowExternalFileCollection', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
