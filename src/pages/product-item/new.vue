<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/product_items" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
        <div slot="header">
          <span style="line-height: 36px;">Create a Product Item</span>

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
          <product-item-form v-model="recordDraft" :record="record" :errors="errors"></product-item-form>
        </div>

        <div class="footer">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button @click="submit(recordDraft)" type="primary" size="medium" class="pull-right">
            Save
          </el-button>
        </div>
    </el-card>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import NewPage from '@/mixins/new-page'
import ProductItemForm from '@/components/product-item-form'

export default {
  name: 'NewProductItem',
  components: {
    ProductItemForm
  },
  mixins: [NewPage({ storeNamespace: 'productItem', name: 'Product Item' })],
  props: ['productId'],
  created () {
    if (!this.productId) {
      return
    }

    let record = _.cloneDeep(this.record)
    record.product = { id: this.productId, type: 'Product' }
    this.$store.dispatch('productItem/setRecord', record)
  },
  methods: {
    recordCreated (record) {
      this.$store.dispatch('product/resetRecord')

      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      if (record.product) {
        this.$store.dispatch('pushRoute', { name: 'ShowProduct', params: { id: record.product.id } })
      }

      this.$store.dispatch('pushRoute', { name: 'ShowProductItem', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
