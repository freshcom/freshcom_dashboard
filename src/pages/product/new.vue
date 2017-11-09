<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a Product</span>

        <div class="pull-right">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button @click="submit(recordDraft)" size="medium" type="primary">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <product-form v-model="recordDraft" :errors="errors"></product-form>
      </div>

      <div class="footer">
        <el-button @click="cancel" plain size="medium">
          Cancel
        </el-button>

        <el-button @click="submit(recordDraft)" size="medium" type="primary" class="pull-right">
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
import ProductForm from '@/components/product-form'

export default {
  name: 'NewProduct',
  props: ['kind', 'parentId'],
  components: {
    ProductForm
  },
  mixins: [NewPage({ storeNamespace: 'product', name: 'Product' })],
  created () {
    let record = _.cloneDeep(this.record)

    if (this.kind) {
      record.kind = this.kind
    }

    if (this.parentId) {
      record.parent = { id: this.parentId, type: 'Product' }
    }

    this.$store.dispatch('product/setRecord', record)
  },
  methods: {
    recordCreated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowProduct', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
