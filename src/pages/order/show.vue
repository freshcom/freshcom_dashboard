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
                    <el-tag v-if="record.status === 'opened'" type="primary">
                      {{$t(`attributes.order.status.${record.status}`)}}
                    </el-tag>
                    <el-tag v-else type="gray">
                      {{$t(`attributes.order.status.${record.status}`)}}
                    </el-tag>
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
                <a @click="addLineItem()" href="javascript:;">
                  <icon name="plus" scale="0.8" class="v-middle"></icon>
                  <span>Add</span>
                </a>
              </span>
            </div>
            <div class="block">
              <div class="block-body full">
                <order-line-item-table @delete="deleteLineItem" @edit="editLineItem" :records="record.rootLineItems" class="block-table">
                </order-line-item-table>
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
                  <el-table-column>
                    <template scope="scope">
                      <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                        <b>
                          <template v-if="scope.row.status === 'pending'">
                            {{scope.row.pendingAmountCents | dollar}}
                          </template>

                          <template v-if="scope.row.status === 'authorized'">
                            {{scope.row.authorizedAmountCents | dollar}}
                          </template>

                          <template v-if="scope.row.status === 'paid'">
                            {{scope.row.paidAmountCents | dollar}}
                          </template>
                        </b>

                        <el-tag type="gray" class="m-l-20">
                          {{$t(`attributes.payment.status.${scope.row.status}`)}}
                        </el-tag>
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column width="150">
                    <template scope="scope">
                      <span>{{scope.row.insertedAt | moment("MMM Do YYYY")}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column width="200">
                    <template scope="scope">
                      <p class="text-right actions">
                        <el-button v-if="scope.row.status === 'pending'" size="mini">
                          Pay
                        </el-button>

                        <el-button v-if="scope.row.status === 'authorized'" size="mini">
                          Capture
                        </el-button>

                        <el-button v-if="scope.row.status === 'authorized' || scope.row.status === 'paid'" size="mini">
                          Refund
                        </el-button>
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

    <div class="launchable">
      <order-line-item-dialog
        v-model="lineItemDraftForUpdate"
        @save="updateLineItem"
        @cancel="closeEditLineItemDialog"
        :is-visible="isEditingLineItem"
        title="Edit Line Item"
      >
      </order-line-item-dialog>

      <order-line-item-dialog
        v-model="lineItemDraftForCreate"
        @save="createLineItem"
        @cancel="closeAddLineItemDialog"
        :is-visible="isAddingLineItem"
        title="Add Line Item"
      >
      </order-line-item-dialog>
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
import OrderLineItemTable from '@/components/order-line-item-table'
import OrderLineItemDialog from '@/components/order-line-item-dialog'
import { dollar } from '@/helpers/filters'

export default {
  name: 'ShowOrder',
  filters: {
    dollar
  },
  components: {
    DeleteButton,
    OrderLineItemDialog,
    OrderLineItemTable
  },
  data () {
    return {
      expandedLineItemIds: []
    }
  },
  computed: {
    isEditingLineItem () {
      return this.$store.state.order.isEditingLineItem
    },
    lineItemDraftForUpdate: {
      get () {
        return this.$store.state.order.lineItemDraftForUpdate
      },
      set (value) {
        this.$store.dispatch('order/setLineItemDraftForUpdate', value)
      }
    },
    isAddingLineItem () {
      return this.$store.state.order.isAddingLineItem
    },
    lineItemDraftForCreate: {
      get () {
        return this.$store.state.order.lineItemDraftForCreate
      },
      set (value) {
        this.$store.dispatch('order/setLineItemDraftForCreate', value)
      }
    }
  },
  mixins: [ShowPage({ storeNamespace: 'order', name: 'Order', include: 'rootLineItems.children,payments' })],
  methods: {
    editRecord () {
      this.$router.push({ name: 'EditOrder', params: { id: this.record.id }, query: { callbackPath: this.currentRoutePath } })
    },
    recordDeleted () {
      this.$store.dispatch('product/resetRecord')
      this.$store.dispatch('popRoute', 1)
    },
    deleteLineItem (id) {
      let orderLineItem = _.find(this.record.rootLineItems, { id: id })
      orderLineItem = _.cloneDeep(orderLineItem)
      orderLineItem.order = this.record
      this.$store.dispatch('order/deleteLineItem', orderLineItem).then(() => {
        this.$message({
          showClose: true,
          message: 'Line Item deleted successfully.',
          type: 'success'
        })
      })
    },
    addLineItem () {
      this.$store.dispatch('order/startAddLineItem')
    },
    closeAddLineItemDialog () {
      this.$store.dispatch('order/endAddLineItem')
    },
    createLineItem (formModel) {
      formModel.order = this.record
      this.$store.dispatch('order/createLineItem', formModel).then(() => {
        this.$message({
          showClose: true,
          message: `Line Item created successfully.`,
          type: 'success'
        })
      })
    },
    editLineItem (lineItemId) {
      let lineItem = _.find(this.record.rootLineItems, { id: lineItemId })
      this.$store.dispatch('order/startEditLineItem', _.cloneDeep(lineItem))
    },
    closeEditLineItemDialog () {
      this.$store.dispatch('order/endEditLineItem')
    },
    updateLineItem (formModel) {
      formModel.order = this.record
      this.$store.dispatch('order/updateLineItem', { id: formModel.id, lineItemDraft: formModel }).then(() => {
        this.$message({
          showClose: true,
          message: `Line Item updated successfully.`,
          type: 'success'
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
