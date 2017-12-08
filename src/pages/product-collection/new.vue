<template>
<div class="page-warpper">
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
        <span style="line-height: 36px;">Create a product collection</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <product-collection-form v-model="productDraft" :errors="errors"></product-collection-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" type="primary" class="pull-right" size="small">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import ProductCollection from '@/models/product-collection'
import ProductCollectionForm from '@/components/product-collection-form'

export default {
  name: 'NewProductCollection',
  props: ['ownerId', 'ownerType'],
  components: {
    ProductCollectionForm
  },
  data () {
    return {
      productDraft: ProductCollection.objectWithDefaults(),
      isCreatingProductCollection: false,
      errors: {}
    }
  },
  created () {
    if (this.ownerId && this.ownerType) {
      this.productDraft.owner = { id: this.ownerId, type: this.ownerType }
    }
  },
  methods: {
    submit () {
      this.isCreatingProductCollection = true

      freshcom.createProductCollection(this.productDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Product collection created successfully.`,
          type: 'success'
        })

        this.isCreatingProductCollection = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingProductCollection = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListProductCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
