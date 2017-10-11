<template>
<div class="main-col">
  <div class="content">
    <div class="secondary-nav">
      <el-menu :router="true" default-active="/orders" mode="horizontal">
        <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      </el-menu>
      <locale-selector @change="loadRecord"></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">

            <div class="brief no-avatar">
              <div class="detail">
                <p>Order {{record.code}}</p>
                <h2>{{record.firstName}} {{record.lastName}}</h2>
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

                  <template v-if="record.code">
                    <dt>Code</dt>
                    <dd>{{record.code}}</dd>
                  </template>

                  <dt>Status</dt>
                  <dd>
                    {{$t(`attributes.order.status.${record.status}`)}}
                  </dd>

                  <dt>Name</dt>
                  <dd>{{record.firstName}} {{record.lastName}}</dd>

                  <dt>Email</dt>
                  <dd>{{record.email}}</dd>

                  <template v-if="record.phoneNumber">
                    <dt>Phone</dt>
                    <dd>{{record.phoneNumber}}</dd>
                  </template>

                  <hr>

                  <dt>Fulfillment Method</dt>
                  <dd>{{$t(`attributes.order.fulfillmentMethod.${record.fulfillmentMethod}`)}}</dd>

                  <template v-if="record.fulfillmentMethod === 'ship'">
                    <dt>Delivery Address</dt>
                    <dd>
                      {{record.deliveryAddressLineOne}}
                      <template v-if="record.deliveryAddressLineTwo">
                        <br>
                        {{record.deliveryAddressLineTwo}}
                      </template>
                      <br>
                      {{record.deliveryAddressCity}}, {{record.deliveryAddressProvince}}, {{record.deliveryAddressCountryCode}}
                      <br>
                      {{record.deliveryAddressPostalCode}}
                    </dd>
                  </template>

                  <hr>

                  <template v-if="record.SubTotalCents != record.grandTotalCents">
                    <dt>Sub Total</dt>
                    <dd>{{record.subTotalCents | dollar}}</dd>
                  </template>

                  <template v-if="record.taxOneCents > 0">
                    <dt>Tax 1</dt>
                    <dd>{{record.taxOneCents | dollar}}</dd>
                  </template>

                  <template v-if="record.taxTwoCents > 0">
                    <dt>Tax 2</dt>
                    <dd>{{record.taxTwoCents | dollar}}</dd>
                  </template>

                  <template v-if="record.taxThreeCents > 0">
                    <dt>Tax 3</dt>
                    <dd>{{record.taxThreeCents | dollar}}</dd>
                  </template>

                  <dt>Grand Total</dt>
                  <dd>{{record.grandTotalCents | dollar}}</dd>
                </dl>
              </div>
            </div>

            <div class="block-title">
              <h3>Line Items</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewOrderLineItem', query: { orderId: record.id, callbackPath: currentRoutePath } }">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </router-link>
              </span>
            </div>
            <div class="block">
              <div class="block-body full">
                <el-table :data="lineItemTableData" @expand="lineItemExpanded" row-key="id" :expand-row-keys="expandedLineItemIds" class="nested-table block-table" style="width: 100%">
                  <el-table-column type="expand" width="40px">
                    <template scope="props">
                      <el-table :data="props.row.children" :show-header="false" style="width: 100%">
                        <el-table-column width="50px" label="" prop="">
                        </el-table-column>
                        <el-table-column width="300px" label="Name" prop="name">
                        </el-table-column>
                        <el-table-column width="150px" label="Qty" prop="orderQuantity">
                        </el-table-column>
                        <el-table-column label="$" prop="subTotal">
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="300px"
                    label="Name"
                    prop="name">
                  </el-table-column>
                  <el-table-column
                    width="150px"
                    label="Qty"
                    prop="quantity">
                  </el-table-column>
                  <el-table-column
                    label="$"
                    prop="subTotal">
                  </el-table-column>
                  <el-table-column label="" width="130px">
                    <template scope="scope">
                      <el-button size="mini">
                        Edit
                      </el-button>
                      <delete-button @confirmed="deleteLineItem(scope.row.id)" size="mini">
                        Delete
                      </delete-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div class="block-title">
              <h3>Payments</h3>

              <span class="block-title-actions pull-right">
                <router-link :to="{ name: 'NewPayment', query: { orderId: record.id, callbackPath: currentRoutePath } }">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </router-link>
              </span>
            </div>

            <div class="block">
              <div class="block-body full">
                <el-table :data="record.payments" stripe class="block-table" :show-header="false" style="width: 100%">
                  <el-table-column width="250">
                    <template scope="scope">
                      <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                        <template v-if="scope.row.status === 'authorized'">
                          {{scope.row.authorizedAmountCents | dollar}}
                        </template>

                        <template v-if="scope.row.status === 'paid'">
                          {{scope.row.paidAmountCents | dollar}}
                        </template>

                        <el-tag v-if="scope.row.status != 'active'" type="gray">
                          {{$t(`attributes.payment.status.${scope.row.status}`)}}
                        </el-tag>
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column width="350">
                    <template scope="scope">
                      <span>{{scope.row.insertedAt | moment("MMM Do YYYY")}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column>
                    <template scope="scope">
                      <p class="text-right actions">

                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>


              <div class="block-footer no-divider text-center">
                <a class="view-more" href="#">View More</a>
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

import _ from 'lodash'
import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'
import { dollar } from '@/helpers/filters'

export default {
  name: 'ShowOrder',
  filters: {
    dollar
  },
  components: {
    DeleteButton
  },
  data () {
    return {
      expandedLineItemIds: []
    }
  },
  computed: {
    lineItemTableData () {
      return _.reduce(this.record.rootLineItems, (acc, lineItem) => {
        let quantity = `${lineItem.orderQuantity}`
        if (lineItem.priceEstimateByDefault) {
          quantity += ` (${lineItem.chargeQuantity}${lineItem.priceChargeUnit})`
        }
        let taxTotalCents = lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents
        let grandTotalCents = lineItem.subTotalCents + lineItem.taxOneCents + lineItem.taxTwoCents + lineItem.taxThreeCents

        return _.concat(acc, {
          id: lineItem.id,
          name: lineItem.name,
          quantity: quantity,
          children: lineItem.children,
          subTotal: dollar(lineItem.subTotalCents),
          taxTotal: dollar(taxTotalCents),
          grandTotal: dollar(grandTotalCents),
          expandable: !!lineItem.product
        })
      }, [])
    }
  },
  mixins: [ShowPage({ storeNamespace: 'order', name: 'Order', include: 'rootLineItems.children,payments' })],
  methods: {
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditOrder', params: { id: this.record.id }, query: { callbackPath: this.currentRoutePath } })
    },
    recordDeleted () {
      this.$store.dispatch('product/resetRecord')
      this.$store.dispatch('popRoute', 1)
    },
    lineItemExpanded (row) {
      if (row.expandable && !_.includes(this.expandedLineItemIds, row.id)) {
        this.expandedLineItemIds = [row.id]
        return
      }
      this.expandedLineItemIds = []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
