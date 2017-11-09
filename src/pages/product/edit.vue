<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector :before-change="confirmResourceLocaleChange" @change="loadRecord" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit Product</span>

        <div style="float: right;">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button @click="submit(recordDraft)" type="primary" size="medium">
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

        <el-button @click="submit(recordDraft)" type="primary" size="medium" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import ProductForm from '@/components/product-form'
import EditPage from '@/mixins/edit-page'

export default {
  name: 'EditProduct',
  components: {
    ProductForm
  },
  mixins: [EditPage({ storeNamespace: 'product', name: 'Product', include: 'avatar,items,externalFileCollections' })],
  methods: {
    recordUpdated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowProduct', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
