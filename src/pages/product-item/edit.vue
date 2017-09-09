<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/product_items" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
      </el-menu>
      <locale-selector :before-change="confirmResourceLocaleChange" @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Edit Product Item</span>

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
            <product-item-form v-model="recordDraft" :record="record" :errors="errors"></product-item-form>
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
import ProductItemForm from '@/components/product-item-form'
import EditPage from '@/mixins/edit-page'

export default {
  name: 'EditProductItem',
  components: {
    ProductItemForm
  },
  mixins: [EditPage({ storeNamespace: 'productItem', name: 'Product Item', include: 'prices' })],
  methods: {
    recordUpdated (record) {
      this.$store.dispatch('product/resetRecord')

      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      if (record.product) {
        return this.$store.dispatch('pushRoute', { name: 'ShowProduct', params: { id: record.product.id } })
      }

      this.$store.dispatch('pushRoute', { name: 'ShowProductItem', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
