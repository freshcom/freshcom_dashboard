<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/products" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">
        Products
      </el-menu-item>

      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product-collections">
        Collections
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Edit product</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form @submit.native.prevent="submit()" label-width="180px" size="small">
            <product-fieldset v-model="productDraft" :errors="errors"></product-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>

<!-- <div class="page-wrapper">

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

</div> -->
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Product from '@/models/product'
import ProductFieldset from '@/components/product-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadProduct' })

export default {
  name: 'EditProduct',
  mixins: [ResourcePageMixin],
  components: {
    ProductFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      product: Product.objectWithDefaults(),
      productDraft: Product.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  methods: {
    loadProduct () {
      this.isLoading = true

      return freshcom.retrieveProduct(this.id, {
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
      this.isUpdating = true

      freshcom.updateProduct(
        this.productDraft.id,
        this.productDraft
      ).then(product => {
        this.$message({
          showClose: true,
          message: `Product saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowProduct', params: { id: this.product.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
