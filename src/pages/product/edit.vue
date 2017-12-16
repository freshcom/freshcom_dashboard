<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector @change="loadProduct()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>
        <span style="line-height: 36px;">Edit product</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
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

        <el-button @click="submit()" type="primary" size="small" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Product from '@/models/product'
import ProductForm from '@/components/product-form'

export default {
  name: 'EditProduct',
  mixins: [PageMixin],
  components: {
    ProductForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      product: Product.objectWithDefaults(),
      productDraft: Product.objectWithDefaults(),

      isUpdatingProduct: false,
      errors: {}
    }
  },
  created () {
    this.loadProduct()
  },
  methods: {
    loadProduct () {
      this.isLoading = true

      freshcom.retrieveProduct(this.id, {
        include: 'avatar'
      }).then(response => {
        this.product = response.data
        this.productDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingProduct = true

      freshcom.updateProduct(
        this.productDraft.id,
        this.productDraft
      ).then(product => {
        this.$message({
          showClose: true,
          message: `Product saved successfully.`,
          type: 'success'
        })

        this.isUpdatingProduct = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingProduct = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowProduct', params: { id: this.product.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
