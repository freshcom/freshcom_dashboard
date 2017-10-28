<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="file_collections" mode="horizontal">
        <el-menu-item :route="{ name: 'ListExternalFile' }" index="files">Files</el-menu-item>
        <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="file_collections">Collections</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Create a File Collection</span>

            <div class="pull-right">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="submit(recordDraft)" type="primary">
                Save
              </el-button>
            </div>
          </div>

          <div class="data">
            <external-file-collection-form v-model="recordDraft" :errors="errors"></external-file-collection-form>
          </div>

          <div class="footer">
            <el-button @click="cancel">
              Cancel
            </el-button>

            <el-button @click="submit(recordDraft)" type="primary" class="pull-right">
              Save
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

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
      record.sku = { id: this.skuId, type: 'Sku' }
      this.$store.dispatch('externalFileCollection/setRecord', record)
      return
    }

    if (this.productId) {
      let record = _.cloneDeep(this.record)
      record.product = { id: this.productId, type: 'Product' }
      this.$store.dispatch('externalFileCollection/setRecord', record)
    }
  },
  methods: {
    recordCreated (record) {
      if (record.sku) {
        this.$store.dispatch('sku/resetRecord')
      }

      if (record.product) {
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
