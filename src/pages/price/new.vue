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
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a Price</span>

        <div class="pull-right">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button @click="submit(recordDraft)" type="primary" size="medium">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <price-form v-model="recordDraft" :record="record" :errors="errors"></price-form>
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
import _ from 'lodash'
import NewPage from '@/mixins/new-page'
import PriceForm from '@/components/price-form'

export default {
  name: 'NewPrice',
  components: {
    PriceForm
  },
  mixins: [NewPage({ storeNamespace: 'price', name: 'Price' })],
  props: ['productKind', 'productId'],
  created () {
    if (this.productId) {
      let record = _.cloneDeep(this.record)
      record.product = { id: this.productId, type: 'Product', kind: this.productKind }
      this.$store.dispatch('price/setRecord', record)
    }
  },
  computed: {
    session () {
      return this.$store.state.session.record
    }
  },
  methods: {
    recordCreated (record) {
      this.$store.dispatch('productItem/resetRecord')
      this.$store.dispatch('product/resetRecord')

      if (this.callbackPath) {
        return this.$store.dispatch('pushRoute', { path: this.callbackPath })
      }

      if (record.productItem) {
        return this.$store.dispatch('pushRoute', { name: 'ShowProductItem', params: { id: record.productItem.id } })
      }

      this.$store.dispatch('pushRoute', { name: 'ShowPrice', params: { id: record.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
