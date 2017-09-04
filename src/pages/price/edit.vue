<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/product_items" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      </el-menu>
      <locale-selector :before-change="confirmResourceLocaleChange" @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Edit Price</span>

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
            <price-form v-model="recordDraft" :record="record" :errors="errors"></price-form>
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
import PriceForm from '@/components/price-form'
import EditPage from '@/mixins/edit-page'

export default {
  name: 'EditPrice',
  components: {
    PriceForm
  },
  mixins: [EditPage({ storeNamespace: 'price', name: 'Price' })],
  methods: {
    recordUpdated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowPrice', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
