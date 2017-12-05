<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a price</span>

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
        <price-form v-model="priceDraft" :record="priceDraft" :errors="errors"></price-form>
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
import freshcom from '@/freshcom-sdk'

import Price from '@/models/price'
import PriceForm from '@/components/price-form'

export default {
  name: 'NewPrice',
  components: {
    PriceForm
  },
  data () {
    return {
      priceDraft: Price.objectWithDefaults(),
      isCreatingPrice: false,
      errors: {}
    }
  },
  props: ['productKind', 'productId', 'callbackPath'],
  created () {
    if (this.productId) {
      this.priceDraft.product = { id: this.productId, type: 'Product', kind: this.productKind }
    }
  },
  methods: {
    submit () {
      this.isCreatingPrice = true

      freshcom.createPrice(this.priceDraft).then(response => {
        this.$message({
          showClose: true,
          message: `Price created successfully.`,
          type: 'success'
        })

        this.isCreatingPrice = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isCreatingPrice = false
      })
    },

    back () {
      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }
      this.$store.dispatch('pushRoute', { name: 'ListPrice' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
