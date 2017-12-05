<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/products" mode="horizontal"  class="secondary-nav">
      <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
      <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
    </el-menu>
    <locale-selector @change="loadPrice()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Edit Price</span>

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
        <price-form v-model="priceDraft" :record="price" :errors="errors"></price-form>
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

import Price from '@/models/price'
import PriceForm from '@/components/price-form'

export default {
  name: 'EditPrice',
  components: {
    PriceForm
  },
  props: ['id', 'callbackPath'],
  data () {
    return {
      isLoading: false,
      price: Price.objectWithDefaults(),
      priceDraft: Price.objectWithDefaults(),

      isUpdatingPrice: false,
      errors: {}
    }
  },
  created () {
    this.loadPrice()
  },
  methods: {
    loadPrice () {
      this.isLoading = true

      freshcom.retrievePrice(this.id, {
        include: 'product,children.product'
      }).then(response => {
        this.price = response.data
        this.priceDraft = _.cloneDeep(response.data)

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    submit () {
      this.isUpdatingPrice = true

      freshcom.updatePrice(
        this.priceDraft.id,
        this.priceDraft
      ).then(price => {
        this.$message({
          showClose: true,
          message: `Price saved successfully.`,
          type: 'success'
        })

        this.isUpdatingPrice = false
        this.back()
      }).catch(errors => {
        this.errors = errors
        this.isUpdatingPrice = false
      })
    },

    back () {
      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }
      this.$store.dispatch('pushRoute', { name: 'ShowPrice', params: { id: this.price.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
