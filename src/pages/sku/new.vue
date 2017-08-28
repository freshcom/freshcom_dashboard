<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="skus" mode="horizontal">
        <el-menu-item :route="{ name: 'ListSku' }" index="skus">SKUs</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Create a SKU</span>

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
import NewPage from '@/mixins/new-page'
import SkuForm from '@/components/sku-form'

export default {
  name: 'NewSku',
  components: {
    SkuForm
  },
  mixins: [NewPage({ storeNamespace: 'sku', name: 'SKU' })],
  methods: {
    recordCreated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowSku', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
