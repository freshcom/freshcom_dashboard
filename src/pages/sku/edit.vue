<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="skus" mode="horizontal">
        <el-menu-item :route="{ name: 'ListSku' }" index="skus">SKUs</el-menu-item>
      </el-menu>
      <locale-selector :before-change="confirmResourceLocaleChange" @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Edit SKU</span>

            <div style="float: right;">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="submit(recordDraft)" type="primary">
                Save
              </el-button>
            </div>
          </div>

          <div class="data">
            <sku-form v-model="recordDraft" :errors="errors"></sku-form>
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
import SkuForm from '@/components/sku-form'
import EditPage from '@/mixins/edit-page'

export default {
  name: 'EditSku',
  components: {
    SkuForm
  },
  mixins: [EditPage({ storeNamespace: 'sku', name: 'SKU', include: 'avatar,externalFileCollections' })],
  methods: {
    recordUpdated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowSku', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
