<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListOrder' }">Orders</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <icon name="inbox" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Order</span>
          <span>{{order.code}}</span>
        </p>
        <h1>{{order.name}}</h1>
        <p class="id">{{order.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditOrder', params: { id: this.order.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{order.id}}</dd>

            <template v-if="order.code">
              <dt>Code</dt>
              <dd>{{order.code}}</dd>
            </template>

            <dt>Status</dt>
            <dd>
              {{$t(`fields.order.status.${order.status}`)}}
            </dd>

            <dt>Payment Status</dt>
            <dd>
              {{$t(`fields.order.paymentStatus.${order.paymentStatus}`)}}
            </dd>

            <dt>Name</dt>
            <dd>{{order.name}}</dd>

            <dt>Email</dt>
            <dd>{{order.email}}</dd>

            <template v-if="order.phoneNumber">
              <dt>Phone</dt>
              <dd>{{order.phoneNumber}}</dd>
            </template>

            <template v-if="order.label">
              <dt>Phone</dt>
              <dd>{{order.label}}</dd>
            </template>

            <hr>

            <dt>Fulfillment Method</dt>
            <dd>{{$t(`fields.order.fulfillmentMethod.${order.fulfillmentMethod}`)}}</dd>

            <dt>Fulfillment Status</dt>
            <dd>{{$t(`fields.order.fulfillmentStatus.${order.fulfillmentStatus}`)}}</dd>

            <template v-if="order.fulfillmentMethod === 'ship'">
              <dt>Delivery Address</dt>
              <dd>
                {{order.deliveryAddressLineOne}}
                <template v-if="order.deliveryAddressLineTwo">
                  <br>
                  {{order.deliveryAddressLineTwo}}
                </template>
                <br>
                {{order.deliveryAddressCity}}, {{order.deliveryAddressProvince}}, {{order.deliveryAddressCountryCode}}
                <br>
                {{order.deliveryAddressPostalCode}}
              </dd>
            </template>

            <hr>

            <template v-if="order.SubTotalCents != order.grandTotalCents">
              <dt>Sub Total</dt>
              <dd>
                <span v-if="order.isEstimate">~</span>
                {{order.subTotalCents | dollar}}
              </dd>
            </template>

            <template v-if="order.taxOneCents > 0">
              <dt>Tax 1</dt>
              <dd>{{order.taxOneCents | dollar}}</dd>
            </template>

            <template v-if="order.taxTwoCents > 0">
              <dt>Tax 2</dt>
              <dd>{{order.taxTwoCents | dollar}}</dd>
            </template>

            <template v-if="order.taxThreeCents > 0">
              <dt>Tax 3</dt>
              <dd>{{order.taxThreeCents | dollar}}</dd>
            </template>

            <dt>Grand Total</dt>
            <dd>
              <span v-if="order.isEstimate">~</span>
              {{order.grandTotalCents | dollar}}
            </dd>

            <dt v-if="order.authorizationTotalCents != order.grandTotalCents">Authorization Total</dt>
            <dd v-if="order.authorizationTotalCents != order.grandTotalCents">{{order.authorizationTotalCents | dollar}}</dd>

            <dt>Opened At</dt>
            <dd>{{order.openedAt | moment}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Line Items</h2>

          <div class="action-group">
            <el-button @click="addLineItem()" size="mini" plain>
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <order-line-item-table :records="order.rootLineItems" @delete="deleteLineItem" @edit="openEditLineItemDialog($event)">
          </order-line-item-table>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteOrder()" plain size="small">
        Delete
      </el-button>
    </div>

    <div class="launchable">
      <el-dialog :show-close="false" :visible="isAddingLineItem" title="Add line item" width="750px">
        <el-form @submit.native.prevent="createLineItem()" label-position="top" size="small">
          <order-line-item-fieldset v-model="lineItemForAdd" :errors="errors"></order-line-item-fieldset>
        </el-form>

        <div slot="footer">
          <el-button :disabled="isCreatingLineItem" @click="cancelAddLineItem()" plain size="small">Cancel</el-button>
          <el-button :loading="isCreatingLineItem" @click="createLineItem()" type="primary" size="small">Save</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>

<!-- <div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">Payments</el-menu-item>
    </el-menu>
    <locale-selector @change="loadOrder" class="pull-right"></locale-selector>
  </div>

  <div v-loading="isLoading" element-loading-background="transparent" class="card-wrapper">
    <el-card v-if="isReady" class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <div class="brief no-avatar">
          <div class="detail">
            <p>Order {{order.code}}</p>
            <h2 v-if="order.firstName">{{order.firstName}} {{order.lastName}}</h2>
            <h2 v-else>{{order.name}}</h2>
            <p class="id">{{order.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editOrder()" plain size="small">Edit</el-button>
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
              <dd>{{order.id}}</dd>

              <template v-if="order.code">
                <dt>Code</dt>
                <dd>{{order.code}}</dd>
              </template>

              <dt>Status</dt>
              <dd>
                {{$t(`fields.order.status.${order.status}`)}}
              </dd>

              <dt>Payment Status</dt>
              <dd>
                {{$t(`fields.order.paymentStatus.${order.paymentStatus}`)}}
              </dd>

              <dt>Name</dt>
              <dd>{{order.name}}</dd>

              <dt>Email</dt>
              <dd>{{order.email}}</dd>

              <template v-if="order.phoneNumber">
                <dt>Phone</dt>
                <dd>{{order.phoneNumber}}</dd>
              </template>

              <template v-if="order.label">
                <dt>Phone</dt>
                <dd>{{order.label}}</dd>
              </template>

              <hr>

              <dt>Fulfillment Method</dt>
              <dd>{{$t(`fields.order.fulfillmentMethod.${order.fulfillmentMethod}`)}}</dd>

              <dt>Fulfillment Status</dt>
              <dd>{{$t(`fields.order.fulfillmentStatus.${order.fulfillmentStatus}`)}}</dd>

              <template v-if="order.fulfillmentMethod === 'ship'">
                <dt>Delivery Address</dt>
                <dd>
                  {{order.deliveryAddressLineOne}}
                  <template v-if="order.deliveryAddressLineTwo">
                    <br>
                    {{order.deliveryAddressLineTwo}}
                  </template>
                  <br>
                  {{order.deliveryAddressCity}}, {{order.deliveryAddressProvince}}, {{order.deliveryAddressCountryCode}}
                  <br>
                  {{order.deliveryAddressPostalCode}}
                </dd>
              </template>

              <hr>

              <template v-if="order.SubTotalCents != order.grandTotalCents">
                <dt>Sub Total</dt>
                <dd>
                  <span v-if="order.isEstimate">~</span>
                  {{order.subTotalCents | dollar}}
                </dd>
              </template>

              <template v-if="order.taxOneCents > 0">
                <dt>Tax 1</dt>
                <dd>{{order.taxOneCents | dollar}}</dd>
              </template>

              <template v-if="order.taxTwoCents > 0">
                <dt>Tax 2</dt>
                <dd>{{order.taxTwoCents | dollar}}</dd>
              </template>

              <template v-if="order.taxThreeCents > 0">
                <dt>Tax 3</dt>
                <dd>{{order.taxThreeCents | dollar}}</dd>
              </template>

              <dt>Grand Total</dt>
              <dd>
                <span v-if="order.isEstimate">~</span>
                {{order.grandTotalCents | dollar}}
              </dd>

              <dt v-if="order.authorizationTotalCents != order.grandTotalCents">Authorization Total</dt>
              <dd v-if="order.authorizationTotalCents != order.grandTotalCents">{{order.authorizationTotalCents | dollar}}</dd>

              <dt>Opened At</dt>
              <dd>{{order.openedAt | moment}}</dd>
            </dl>
          </div>
        </div>

        <div class="block-title">
          <h3>Line Items</h3>

          <span class="block-title-actions pull-right">
            <a @click="openAddLineItemDialog()" href="javascript:;">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </a>
          </span>
        </div>
        <div class="block">
          <div class="block-body full">
            <order-line-item-table @delete="deleteLineItem" @edit="openEditLineItemDialog($event)" :records="order.rootLineItems">
            </order-line-item-table>
          </div>
        </div>

        <div class="block-title">
          <h3>
            Payments
          </h3>

          <span class="block-title-actions pull-right">
            <a @click="openAddPaymentDialog()" href="javascript:;">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </a>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="payments" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                    <b>
                      <span>
                        {{scope.row.amountCents | dollar}}
                      </span>
                    </b>
                  </router-link>

                  <el-tag size="mini" type="info" class="m-l-10">
                    {{$t(`fields.payment.status.${scope.row.status}`)}}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column width="200">
                <template slot-scope="scope">
                  <span>{{scope.row.insertedAt | moment}}</span>
                </template>
              </el-table-column>

              <el-table-column width="200">
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <el-button v-if="canEditPayment(scope.row)" @click="openEditPaymentDialog(scope.row)" plain size="mini">
                      Edit
                    </el-button>

                    <el-button v-if="scope.row.status === 'authorized'" @click="openEditPaymentDialog(scope.row)" plain size="mini">
                      Capture
                    </el-button>

                    <el-button v-if="canRefundPayment(scope.row)" @click="openAddRefundDialog(scope.row)" plain size="mini">
                      Refund
                    </el-button>

                    <confirm-button v-if="scope.row.status === 'pending'" @confirmed="deletePayment(scope.row.id)" size="mini">
                      Delete
                    </confirm-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="block-title">
          <h3>Fulfillments</h3>
        </div>
        <div class="block">
          <div class="block-body full">
            <el-table
              :data="fulfillmentPackages"
              :show-header="false"
              row-key="id"
              class="nested-block-table column-compact"
              style="width: 100%"
            >
              <el-table-column type="expand" width="30px">
                <template slot-scope="props">
                  <el-table :data="props.row.items" :show-header="false" style="width: 100%">
                    <el-table-column width="30px"></el-table-column>
                    <el-table-column label="Name" prop="name">
                      <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>

                        <el-tag size="mini" type="info" class="m-l-10">
                          {{$t(`fields.fulfillmentItem.status.${scope.row.status}`)}}
                        </el-tag>
                      </template>

                    </el-table-column>
                    <el-table-column width="80px" label="Qty" prop="quantity">
                      <template slot-scope="scope">
                        x {{scope.row.quantity}}
                      </template>
                    </el-table-column>
                    <el-table-column width="120px" label="Qty" prop="quantity">
                      <template slot-scope="scope">
                        <span v-if="scope.row.source">{{scope.row.source.type}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="140px">
                      <template slot-scope="scope">
                        <p class="text-right actions">
                          <confirm-button v-if="scope.row.status === 'pending'" size="mini">
                            Fulfill
                          </confirm-button>

                          <confirm-button v-if="scope.row.status === 'fulfilled'" @confirmed="returnFulfillmentItem(scope.row)" confirm-button-text="Yes" size="mini">
                            Return
                          </confirm-button>

                          <confirm-button v-if="scope.row.status === 'fulfilled'" @confirmed="discardFulfillmentItem(scope.row)" confirm-button-text="Yes" size="mini">
                            Discard
                          </confirm-button>

                          <confirm-button v-if="scope.row.status === 'pending'" size="mini">
                            Delete
                          </confirm-button>
                        </p>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="Name" prop="name" width="270px">
                <template slot-scope="scope">
                  <b>{{scope.row.insertedAt | moment}}</b>

                  <el-tag size="mini" type="info" class="m-l-10">
                    {{$t(`fields.fulfillmentPackage.status.${scope.row.status}`)}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <b class="m-l-10">
                    {{$t(`fields.fulfillmentPackage.systemLabel.${scope.row.systemLabel}`)}}
                  </b>
                </template>
              </el-table-column>

              <el-table-column width="120">
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <confirm-button v-if="canDeleteFulfillmentPackage(scope.row)" @confirmed="deleteFulfillmentPackage(scope.row.id)" size="mini">
                      Delete
                    </confirm-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="block-title">
          <h3>Returns</h3>
        </div>
        <div class="block">
          <div class="block-body full">
            <el-table
              :data="returnPackages"
              :show-header="false"
              row-key="id"
              class="nested-block-table column-compact"
              style="width: 100%"
            >
              <el-table-column type="expand" width="30px">
                <template slot-scope="props">
                  <el-table :data="props.row.items" :show-header="false" style="width: 100%">
                    <el-table-column width="30px"></el-table-column>
                    <el-table-column label="Name" prop="name">
                      <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>

                        <el-tag size="mini" type="info" class="m-l-10">
                          {{$t(`fields.returnItem.status.${scope.row.status}`)}}
                        </el-tag>
                      </template>

                    </el-table-column>
                    <el-table-column width="80px" label="Qty" prop="quantity">
                      <template slot-scope="scope">
                        x {{scope.row.quantity}}
                      </template>
                    </el-table-column>
                    <el-table-column width="140px">
                      <template slot-scope="scope">
                        <p class="text-right actions">

                        </p>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="Name" prop="name" width="230px">
                <template slot-scope="scope">
                  <b>{{scope.row.insertedAt | moment}}</b>

                  <el-tag size="mini" type="info" class="m-l-10">
                    {{$t(`fields.returnPackage.status.${scope.row.status}`)}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <b class="m-l-10">
                    {{$t(`fields.returnPackage.systemLabel.${scope.row.systemLabel}`)}}
                  </b>
                </template>
              </el-table-column>

              <el-table-column width="120">
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <confirm-button v-if="canDeleteReturnPackage(scope.row)" @confirmed="deleteReturnPackage(scope.row.id)" size="mini">
                      Delete
                    </confirm-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="block-title">
          <h3>Custom Data</h3>
        </div>
        <div class="block">
          <div class="block-body">
            {{order.customData}}
          </div>
        </div>

        <div class="block-title">
          <h3>Related Resources</h3>
        </div>
        <div class="block">
          <div class="block-body">
             <dl>
                <dt v-if="order.customer">Customer</dt>
                <dd v-if="order.customer">
                  <router-link :to="{ name: 'ShowCustomer', params: { id: order.customer.id }}">
                    {{order.customer.id}}
                  </router-link>
                </dd>
              </dl>
          </div>
        </div>
      </div>

      <div class="footer text-right">
        <confirm-button @confirmed="deleteOrder()" size="small">Delete</confirm-button>
      </div>
    </el-card>
  </div>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isAddingLineItem" title="Add Line Item" width="750px">
      <order-line-item-form v-model="lineItemForAdd"></order-line-item-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingLineItem" @click="closeAddLineItemDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingLineItem" @click="createLineItem()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isEditingLineItem" title="Edit Line Item" width="750px">
      <order-line-item-form v-model="lineItemDraftForEdit"></order-line-item-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingLineItem" @click="closeEditLineItemDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingLineItem" @click="updateLineItem()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isAddingPayment" title="Add Payment" width="750px">
      <payment-form v-model="paymentDraftForAdd"></payment-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingPayment" @click="closeAddPaymentDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingPayment" @click="createPayment()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isEditingPayment" title="Edit Payment" width="600px">
      <payment-form v-model="paymentDraftForEdit" :errors="errors"></payment-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingPayment" @click="closeEditPaymentDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingPayment" @click="updatePayment()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>

    <el-dialog :show-close="false" :visible="isAddingRefund" title="Refund Payment" width="500px">
      <refund-form v-model="refundDraftForAdd" :errors="errors"></refund-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingRefund" @click="closeAddRefundDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingRefund" @click="createRefund()" type="primary" size="small">Refund {{refundDraftForAdd.amountCents | dollar}}</el-button>
      </div>
    </el-dialog>
  </div>
</div> -->

</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import Order from '@/models/order'
import OrderLineItem from '@/models/order-line-item'
import Payment from '@/models/payment'
import Refund from '@/models/refund'

import OrderLineItemFieldset from '@/components/order-line-item-form'
import PaymentForm from '@/components/payment-form'
import RefundForm from '@/components/refund-form'

import ConfirmButton from '@/components/confirm-button'
import OrderLineItemTable from '@/components/order-line-item-table'
import { dollar } from '@/helpers/filters'
import { createToken as createStripeToken } from 'vue-stripe-elements-plus'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadResources' })

export default {
  name: 'ShowOrder',
  mixins: [ResourcePageMixin],
  components: {
    RefundForm,
    PaymentForm,
    OrderLineItemFieldset,
    ConfirmButton,
    OrderLineItemTable
  },
  filters: {
    dollar
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isReady: false,
      order: Order.objectWithDefaults(),

      payments: [],
      fulfillmentPackages: [],
      returnPackages: [],

      lineItemForAdd: OrderLineItem.objectWithDefaults(),
      isAddingLineItem: false,
      isCreatingLineItem: false,

      lineItemForEdit: OrderLineItem.objectWithDefaults(),
      lineItemDraftForEdit: OrderLineItem.objectWithDefaults(),
      isEditingLineItem: false,
      isUpdatingLineItem: false,

      paymentForEdit: Payment.objectWithDefaults(),
      paymentDraftForEdit: Payment.objectWithDefaults(),
      isEditingPayment: false,
      isUpdatingPayment: false,

      paymentDraftForAdd: Payment.objectWithDefaults(),
      isAddingPayment: false,
      isCreatingPayment: false,

      refundDraftForAdd: Refund.objectWithDefaults(),
      isAddingRefund: false,
      isCreatingRefund: false,

      expandedLineItemIds: [],
      errors: {}
    }
  },
  methods: {
    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListOrder' })
    },

    loadResources () {
      return Promise.all([
        this.loadOrder(),
        this.loadPayments(),
        this.loadFulfillmentPackages(),
        this.loadReturnPackages()
      ])
    },

    //
    // MARK: Order
    //
    loadOrder () {
      return freshcom.retrieveOrder(this.id, {
        include: 'rootLineItems.children'
      }).then(response => {
        this.order = response.data
        return response
      })
    },

    attemptDeleteOrder () {

    },

    deleteOrder () {
      freshcom.deleteOrder(this.id).then(() => {
        this.$message({
          showClose: true,
          message: `Order deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    // MARK: Line Item

    addLineItem () {
      this.lineItemForAdd = OrderLineItem.objectWithDefaults()
      this.lineItemForAdd.order = this.order
      this.errors = {}
      this.isAddingLineItem = true
    },

    cancelAddLineItem () {
      this.isAddingLineItem = false
      this.isCreatingLineItem = false
    },

    createLineItem () {
      this.isCreatingLineItem = true

      freshcom.createOrderLineItem(this.id, this.lineItemForAdd).then(() => {
        return this.loadOrder()
      }).then(response => {
        this.$message({
          showClose: true,
          message: `Line Item created successfully.`,
          type: 'success'
        })

        this.cancelAddLineItem()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingLineItem = false
        throw response
      })
    },

    openEditLineItemDialog (lineItemId) {
      let lineItem = _.find(this.order.rootLineItems, { id: lineItemId })
      this.lineItemForEdit = lineItem
      this.lineItemDraftForEdit = _.cloneDeep(lineItem)

      this.isEditingLineItem = true
    },

    closeEditLineItemDialog () {
      this.isEditingLineItem = false
      this.isUpdatingLineItem = false
    },

    updateLineItem () {
      this.isUpdatingLineItem = true

      freshcom.updateOrderLineItem(this.lineItemDraftForEdit.id, this.lineItemDraftForEdit).then(() => {
        return this.loadOrder()
      }).then(response => {
        this.$message({
          showClose: true,
          message: `Line item saved successfully.`,
          type: 'success'
        })

        this.closeEditLineItemDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingLineItem = false
        throw response
      })
    },

    deleteLineItem (id) {
      freshcom.deleteOrderLineItem(id).then(() => {
        return this.loadOrder()
      }).then(response => {
        this.$message({
          showClose: true,
          message: `Line item deleted successfully.`,
          type: 'success'
        })
      })
    },

    //
    // MARK: Payment
    //
    loadPayments () {
      return freshcom.listPayment({
        filter: { targetId: this.id, targetType: 'Order' }
      }).then(response => {
        this.payments = response.data
        return response
      })
    },

    canEditPayment (payment) {
      return payment.status === 'pending'
    },

    canRefundPayment (payment) {
      return payment.status === 'partially_refunded' || payment.status === 'paid'
    },

    openAddPaymentDialog () {
      let paymentDraft = Payment.objectWithDefaults()

      paymentDraft.target = this.order
      paymentDraft.owner = this.order.customer

      this.paymentDraftForAdd = paymentDraft
      this.isAddingPayment = true
    },

    closeAddPaymentDialog () {
      this.isAddingPayment = false
      this.isCreatingPayment = false
    },

    createPayment () {
      this.isCreatingPayment = true

      let paymentCreated
      if (this.paymentDraftForAdd.gateway === 'freshcom') {
        paymentCreated = createStripeToken().then(data => {
          this.paymentDraftForAdd.source = data.token.id
          return freshcom.createPayment(this.paymentDraftForAdd)
        })
      } else {
        paymentCreated = freshcom.createPayment(this.paymentDraftForAdd)
      }

      paymentCreated.then(() => {
        return Promise.all([
          this.loadOrder(),
          this.loadPayments()
        ])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Payment created successfully.`,
          type: 'success'
        })

        this.closeAddPaymentDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingPayment = false
        throw response
      })
    },

    openAddRefundDialog (payment) {
      let refundDraft = Refund.objectWithDefaults()

      refundDraft.payment = payment
      refundDraft.gateway = payment.gateway
      refundDraft.processor = payment.processor
      refundDraft.amountCents = payment.grossAmountCents
      refundDraft.owner = payment.owner
      refundDraft.target = payment.target

      this.refundDraftForAdd = refundDraft
      this.errors = {}
      this.isAddingRefund = true
    },

    closeAddRefundDialog () {
      this.isAddingRefund = false
      this.isCreatingRefund = false
    },

    createRefund () {
      this.isCreatingRefund = true

      freshcom.createRefund(this.refundDraftForAdd.payment.id, this.refundDraftForAdd).then(() => {
        return Promise.all([
          this.loadOrder(),
          this.loadPayments()
        ])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Refund created successfully.`,
          type: 'success'
        })

        this.closeAddRefundDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingRefund = false
        throw response
      })
    },

    openEditPaymentDialog (payment) {
      let paymentDraft = _.cloneDeep(payment)

      this.paymentDraftForEdit = paymentDraft
      this.errors = {}
      this.isEditingPayment = true
    },

    closeEditPaymentDialog () {
      this.isEditingPayment = false
      this.isUpdatingPayment = false
    },

    updatePayment () {
      this.isUpdatingPayment = true

      freshcom.updatePayment(this.paymentDraftForEdit.id, this.paymentDraftForEdit).then(() => {
        return Promise.all([
          this.loadOrder(),
          this.loadPayments()
        ])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Payment updated successfully.`,
          type: 'success'
        })

        this.closeEditPaymentDialog()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingPayment = false
        throw response
      })
    },

    deletePayment (id) {
      freshcom.deletePayment(id).then(() => {
        return Promise.all([
          this.loadOrder(),
          this.loadPayments()
        ])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Payment deleted successfully.`,
          type: 'success'
        })
      })
    },

    //
    // MARK: Fulfillment Package
    //
    loadFulfillmentPackages () {
      return freshcom.listFulfillmentPackage({
        filter: { orderId: this.id },
        include: 'items'
      }).then(response => {
        this.fulfillmentPackages = response.data
        return response
      })
    },

    canDeleteFulfillmentPackage (fulfillmentPackage) {
      return _.includes(['pending', 'in_progress', 'discarded'], fulfillmentPackage.status)
    },

    deleteFulfillmentPackage (id) {
      freshcom.deleteFulfillmentPackage(id).then(response => {
        return Promise.all([
          this.loadOrder(),
          this.loadFulfillmentPackages()
        ])
      })
    },

    returnFulfillmentItem (fulfillmentItem) {
      let returnItemDraft = {
        type: 'ReturnItem',
        status: 'returned',
        quantity: fulfillmentItem.quantity,
        fulfillmentItem: fulfillmentItem
      }

      freshcom.createReturnItem(returnItemDraft).then(response => {
        return Promise.all([
          this.loadOrder(),
          this.loadFulfillmentPackages(),
          this.loadReturnPackages()
        ])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Return item created successfully.`,
          type: 'success'
        })
      })
    },

    discardFulfillmentItem (fulfillmentItem) {
      let fulfillmentItemDraft = _.cloneDeep(fulfillmentItem)
      fulfillmentItemDraft.status = 'discarded'

      let fpackage = _.find(this.fulfillmentPackages, { id: fulfillmentItem.package.id })
      freshcom.updateFulfillmentItem(fulfillmentItem.id, fulfillmentItemDraft).then(response => {
        let fulfillmentItem = response.data
        let item = _.find(fpackage.items, { id: fulfillmentItem.id })
        item.status = fulfillmentItem.status

        return Promise.all([
          this.loadOrder(),
          this.loadFulfillmentPackages()
        ])
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Fulfillment item discarded successfully.`,
          type: 'success'
        })
      })
    },

    //
    // MARK: Return Package
    //
    loadReturnPackages () {
      return freshcom.listReturnPackage({
        filter: { orderId: this.id },
        include: 'items'
      }).then(response => {
        this.returnPackages = response.data
        return response
      })
    },

    canDeleteReturnPackage (returnPackage) {
      return _.includes(['pending', 'in_progress'], returnPackage.status)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
