<template>
<div class="main-col">
  <div class="content">
    <div class="secondary-nav">
      <el-menu :router="true" default-active="/product_items" mode="horizontal">
        <el-menu-item :route="{ name: 'ListProduct' }" index="/products">Products</el-menu-item>
        <el-menu-item :route="{ name: 'ListProductItem' }" index="/product_items">Items</el-menu-item>
      </el-menu>
      <locale-selector @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">

            <div class="brief no-avatar">
              <div class="detail">
                <p>Price {{record.code}}</p>
                <h2>{{record.name}}</h2>
                <p class="id">{{record.id}}</p>
              </div>
            </div>

            <div class="header-actions">
              <el-button @click="editRecord()">Edit</el-button>
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
                  <dd>{{record.id}}</dd>

                  <dt>Code</dt>
                  <dd>{{record.code}}</dd>

                  <dt>Status</dt>
                  <dd>
                    {{$t(`attributes.price.status.${record.status}`)}}
                    <el-button v-if="record.status == 'draft'" type="primary" size="mini" class="m-l-10">
                      Mark Active
                    </el-button>
                  </dd>

                  <dt>Name</dt>
                  <dd>{{record.name}}</dd>

                  <dt>Label</dt>
                  <dd>{{record.label}}</dd>

                  <dt>Charge Amount</dt>
                  <dd>${{record.chargeCents / 100}} / {{record.chargeUnit}}</dd>

                  <dt>Order Unit</dt>
                  <dd>{{record.orderUnit}}</dd>

                  <dt>Estimate By Default</dt>
                  <dd>{{record.estimateByDefault}}</dd>

                  <dt>Estimate Average</dt>
                  <dd>
                    {{record.estimateAveragePercentage}}<span v-if="record.estimateAveragePercentage">%</span>
                  </dd>

                  <dt>Maximum Average</dt>
                  <dd>
                    {{record.estimateMaximumPercentage}}<span v-if="record.estimateMaximumPercentage">%</span>
                  </dd>

                  <dt>Minimum OQ</dt>
                  <dd>{{record.minimumOrderQuantity}}</dd>

                  <dt>Tax One</dt>
                  <dd>{{record.taxOnePercentage}}%</dd>

                  <dt>Tax Two</dt>
                  <dd>{{record.taxTwoPercentage}}%</dd>

                  <dt>Tax Three</dt>
                  <dd>{{record.taxThreePercentage}}%</dd>
                </dl>
              </div>
            </div>

            <div class="block-title">
              <h3>Custom Data</h3>
            </div>
            <div class="block">
              <div class="block-body">
                {{record.customData}}
              </div>
            </div>

            <h3>Related Resources</h3>
            <div class="block">
              <div class="block-body">
                <dl>
                  <dt v-if="record.productItem">Product Item</dt>
                  <dd v-if="record.productItem">
                    <router-link :to="{ name: 'ShowProductItem', params: { id: record.productItem.id }}">
                      {{record.productItem.id}}
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
            <delete-button @confirmed="deleteRecord">Delete</delete-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowPrice',
  components: {
    DeleteButton
  },
  mixins: [ShowPage({ storeNamespace: 'price', name: 'Price' })],
  computed: {
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditPrice', params: { id: this.record.id } })
    },
    recordDeleted () {
      this.$store.dispatch('productItem/resetRecord')
      this.$store.dispatch('product/resetRecord')

      this.$store.dispatch('popRoute', 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
