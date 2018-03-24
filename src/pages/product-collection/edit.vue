<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/product_collections" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
        Products
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">
        Collections
      </el-menu-item>
    </el-menu>
    <locale-selector @change="searchProductCollection()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>
        <span style="line-height: 36px;">Edit product collection</span>

        <div style="float: right;">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button :loading="isUpdating" @click="submit()" size="small" type="primary">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <product-collection-form v-model="productCollectionDraft" :errors="errors"></product-collection-form>
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
import ProductCollection from '@/models/product-collection'
import ProductCollectionForm from '@/components/product-collection-form'

export default {
  name: 'EditProductCollection',
  mixins: [PageMixin],
  components: {
    ProductCollectionForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      productCollection: ProductCollection.objectWithDefaults(),
      productCollectionDraft: ProductCollection.objectWithDefaults(),

      isUpdatingProductCollection: false,
      errors: {}
    }
  },
  created () {
    this.loadProductCollection()
  },
  methods: {
    loadProductCollection () {
      this.isLoading = true

      freshcom.retrieveProductCollection(this.id).then(response => {
        this.productCollection = response.data
        this.productCollectionDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingProductCollection = true

      freshcom.updateProductCollection(
        this.productCollectionDraft.id,
        this.productCollectionDraft
      ).then(productCollection => {
        this.$message({
          showClose: true,
          message: `Product collection saved successfully.`,
          type: 'success'
        })

        this.isUpdatingProductCollection = false
        this.back()
      }).catch(response => {
        this.errors = response.data
        this.isUpdatingProductCollection = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowProductCollection', params: { id: this.productCollection.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
