<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/product_items" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Create a Price</span>

            <div class="pull-right">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="submit(recordDraft)" type="primary">
                Save
              </el-button>
            </div>
          </div>

          <div class="data">
            <price-form v-model="recordDraft" :record="record" :errors="errors"></price-form>
          </div>

          <div class="footer">
            <el-button @click="cancel">
              Cancel
            </el-button>

            <el-button @click="submit(recordDraft)" type="primary" class="pull-right">
              Save
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import _ from 'lodash'
import NewPage from '@/mixins/new-page'
import PriceForm from '@/components/price-form'

export default {
  name: 'NewProductItem',
  components: {
    PriceForm
  },
  mixins: [NewPage({ storeNamespace: 'price', name: 'Price' })],
  props: ['productItemId', 'callbackPath'],
  created () {
    if (!this.productItemId) {
      return
    }

    let record = _.cloneDeep(this.record)
    record.productItem = { id: this.productItemId, type: 'ProductItem' }
    this.$store.dispatch('price/setRecord', record)
  },
  methods: {
    recordCreated (record) {
      this.$store.dispatch('pushRoute', { name: 'ShowPrice', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
