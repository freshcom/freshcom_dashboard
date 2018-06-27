<template>
<content-container>
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
    <h1>Create a product</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
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

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Product from '@/models/product'
import ProductFieldset from '@/components/product-fieldset'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewProduct',
  mixins: [PageMixin],
  props: {
    kind: {
      type: String
    },
    parentId: {
      type: String
    }
  },
  components: {
    ProductFieldset
  },
  data () {
    return {
      productDraft: Product.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  created () {
    if (this.parentId) {
      this.productDraft.parent = { type: 'Product', id: this.parentId }
    }

    if (this.kind) {
      this.productDraft.kind = this.kind
    }
  },
  methods: {
    submit () {
      this.isCreating = true

      freshcom.createProduct(this.productDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Product created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    },
    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListProduct' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
