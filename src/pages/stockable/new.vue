<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/stockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">Stockables</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a Stockable</span>

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
        <stockable-form v-model="recordDraft" :errors="errors"></stockable-form>
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
import NewPage from '@/mixins/new-page'
import StockableForm from '@/components/stockable-form'

export default {
  name: 'NewStockable',
  components: {
    StockableForm
  },
  mixins: [NewPage({ storeNamespace: 'stockable', name: 'Stockable' })],
  methods: {
    recordCreated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowStockable', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
