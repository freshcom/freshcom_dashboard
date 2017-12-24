<template>
<div class="main-col">
  <div class="content">
    <div>
      <el-menu :router="true" default-active="/products" mode="horizontal" class="secondary-nav">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductCollection' }" index="/product_collections">Collections</el-menu-item>
      </el-menu>
      <locale-selector @change="loadPrice()" class="pull-right"></locale-selector>
    </div>

    <div>
      <el-card v-loading="isLoading" class="main-card">
        <div slot="header">

          <div class="brief no-avatar">
            <div class="detail">
              <p>Price {{price.code}}</p>
              <h2>{{price.name}}</h2>
              <p class="id">{{price.id}}</p>
            </div>
          </div>

          <div class="header-actions">
            <el-button @click="editPrice()" plain size="small">Edit</el-button>
          </div>
        </div>

        <div class="data">
          <div class="block-title">
            <h3>Details</h3>
          </div>
          <div class="block">
            <div class="block-body">
              <dl>
                <dt>ID</dt>
                <dd>{{price.id}}</dd>

                <dt>Code</dt>
                <dd>{{price.code}}</dd>

                <dt>Status</dt>
                <dd>
                  {{$t(`fields.price.status.${price.status}`)}}
                </dd>

                <dt>Name</dt>
                <dd>{{price.name}}</dd>

                <dt>Label</dt>
                <dd>{{price.label}}</dd>

                <dt>Charge Amount</dt>
                <dd>${{price.chargeAmountCents / 100}} / {{price.chargeUnit}}</dd>

                <dt>Order Unit</dt>
                <dd>{{price.orderUnit}}</dd>

                <dt>Estimate By Default</dt>
                <dd>{{price.estimateByDefault}}</dd>

                <dt>Estimate Average</dt>
                <dd>
                  {{price.estimateAveragePercentage}}<span v-if="price.estimateAveragePercentage">%</span>
                </dd>

                <dt>Maximum Average</dt>
                <dd>
                  {{price.estimateMaximumPercentage}}<span v-if="price.estimateMaximumPercentage">%</span>
                </dd>

                <dt>Minimum OQ</dt>
                <dd>{{price.minimumOrderQuantity}}</dd>

                <dt>Tax One</dt>
                <dd>{{price.taxOnePercentage}}%</dd>

                <dt>Tax Two</dt>
                <dd>{{price.taxTwoPercentage}}%</dd>

                <dt>Tax Three</dt>
                <dd>{{price.taxThreePercentage}}%</dd>
              </dl>
            </div>
          </div>

          <div class="block-title">
            <h3>Custom Data</h3>
          </div>
          <div class="block">
            <div class="block-body">
              {{price.customData}}
            </div>
          </div>

          <h3>Related Resources</h3>
          <div class="block">
            <div class="block-body">
              <dl>
                <dt v-if="price.productItem">Product Item</dt>
                <dd v-if="price.productItem">
                  <router-link :to="{ name: 'ShowProductItem', params: { id: price.productItem.id }}">
                    {{price.productItem.id}}
                  </router-link>
                </dd>

                <dt v-if="price.product">Product</dt>
                <dd v-if="price.product">
                  <router-link :to="{ name: 'ShowProduct', params: { id: price.product.id }}">
                    {{price.product.id}}
                  </router-link>
                </dd>
              </dl>
            </div>
          </div>

          <h3>Logs</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>

          <h3>Events</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>
        </div>

        <div class="footer text-right">
          <confirm-button @confirmed="deletePrice()" size="small">Delete</confirm-button>
        </div>
      </el-card>
    </div>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/plus'
import freshcom from '@/freshcom-sdk'

import Price from '@/models/price'
import ConfirmButton from '@/components/confirm-button'
import { idLastPart } from '@/helpers/filters'

export default {
  name: 'ShowPrice',
  components: {
    ConfirmButton
  },
  filters: {
    idLastPart
  },
  props: ['id'],
  data () {
    return {
      price: Price.objectWithDefaults(),
      isLoading: false
    }
  },
  created () {
    this.loadPrice()
  },
  computed: {
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadPrice () {
      this.isLoading = true

      freshcom.retrievePrice(this.id, {
        include: 'children'
      }).then(response => {
        this.price = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    editPrice () {
      this.$store.dispatch('pushRoute', {
        name: 'EditPrice',
        params: { id: this.price.id }
      })
    },

    deletePrice () {
      freshcom.deletePrice(this.price.id).then(() => {
        this.$message({
          showClose: true,
          message: `Price deleted successfully.`,
          type: 'success'
        })

        this.back()
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
<style scoped>
</style>
