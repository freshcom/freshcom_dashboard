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
    <div class="brief">
      <div class="avatar">
        <icon name="dollar" class="avatar-icon" style="width: 30px;"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Price</span>
          <span>{{price.code}}</span>
        </p>
        <h1>{{price.name}}</h1>
        <p class="id">{{price.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditPrice', params: { id: price.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
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

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{price.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="price.product">Product</dt>
            <dd v-if="price.product">
              <router-link :to="{ name: 'ShowProduct', params: { id: price.product.id }}">
               {{price.product.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <confirm-button @confirmed="deletePrice()" size="small">Delete</confirm-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Price from '@/models/price'
import ConfirmButton from '@/components/confirm-button'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadPrice' })

export default {
  name: 'ShowPrice',
  mixins: [ResourcePageMixin],
  components: {
    ConfirmButton
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      price: Price.objectWithDefaults(),
      isLoading: false
    }
  },
  methods: {
    loadPrice () {
      this.isLoading = true

      return freshcom.retrievePrice(this.id).then(response => {
        this.price = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
