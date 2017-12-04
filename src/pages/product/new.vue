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
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a Product</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" size="small" type="primary">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <product-form v-model="productDraft" :errors="errors"></product-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" size="small" type="primary" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Product from '@/models/product'
import ProductForm from '@/components/product-form'

export default {
  name: 'NewProduct',
  props: ['kind', 'parentId'],
  components: {
    ProductForm
  },
  data () {
    return {
      productDraft: Product.objectWithDefaults(),
      isCreatingProduct: false,
      errors: {}
    }
  },
  methods: {
    submit () {
      this.isCreatingProduct = true

      freshcom.createProduct(this.productDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Product created successfully.`,
          type: 'success'
        })

        this.isCreatingProduct = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isCreatingProduct = false
      })
    },
    back () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
