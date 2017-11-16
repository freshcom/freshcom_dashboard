<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">Payments</el-menu-item>
    </el-menu>
    <locale-selector @change="loadOrder" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief no-avatar">
          <div class="detail">
            <p>Order {{order.code}}</p>
            <h2>{{order.firstName}} {{order.lastName}}</h2>
            <p class="id">{{order.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editRecord()" size="medium">Edit</el-button>
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
                {{$t(`attributes.order.status.${order.status}`)}}
              </dd>

              <dt>Payment Status</dt>
              <dd>
                {{$t(`attributes.order.paymentStatus.${order.paymentStatus}`)}}
              </dd>

              <dt>Name</dt>
              <dd>{{order.firstName}} {{order.lastName}}</dd>

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
              <dd>{{$t(`attributes.order.fulfillmentMethod.${order.fulfillmentMethod}`)}}</dd>

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

              <dt v-if="order.authorizationCents != order.grandTotalCents">Authorization Total</dt>
              <dd v-if="order.authorizationCents != order.grandTotalCents">{{order.authorizationCents | dollar}}</dd>

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
            <el-table :data="payments" stripe class="block-table" :show-header="false" style="width: 100%">
              <el-table-column>
                <template scope="scope">
                  <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                    <b>
                      <span>
                        {{scope.row.amountCents | dollar}}
                      </span>
                    </b>
                  </router-link>

                  <el-tag size="mini" type="info" class="m-l-20">
                    {{$t(`attributes.payment.status.${scope.row.status}`)}}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column width="200">
                <template scope="scope">
                  <span>{{scope.row.insertedAt | moment}}</span>
                </template>
              </el-table-column>

              <el-table-column width="200">
                <template scope="scope">
                  <p class="text-right actions">
                    <el-button v-if="scope.row.status === 'pending'" @click="openEditPaymentDialog(scope.row)" size="mini">
                      Pay
                    </el-button>

                    <el-button v-if="scope.row.status === 'authorized'" @click="openEditPaymentDialog(scope.row)" plain size="mini">
                      Capture
                    </el-button>

                    <el-button v-if="canRefundPayment(scope.row)" @click="openAddRefundDialog(scope.row)" plain size="mini">
                      Refund
                    </el-button>

                    <delete-button v-if="scope.row.status === 'pending'" @confirmed="deletePayment(scope.row)" size="mini">
                      Delete
                    </delete-button>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>


          <div class="block-footer text-center">
            <a class="view-more" href="#">View More</a>
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

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
             <dl>
                <dt v-if="order.customer">Customer</dt>
                <dd v-if="order.customer"><a href="#">{{order.customer.id}}</a></dd>
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
        <delete-button @confirmed="deleteOrder()" size="medium">Delete</delete-button>
      </div>
    </el-card>
  </div>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isAddingLineItem" title="Add Line Item" width="750px">
      <order-line-item-form v-model="lineItemDraftForAdd"></order-line-item-form>

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

    <el-dialog :show-close="false" :visible="isAddingRefund" title="Refund Payment" width="500px">
      <refund-form v-model="refundDraftForAdd"></refund-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isCreatingRefund" @click="closeAddRefundDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isCreatingRefund" @click="createRefund()" type="primary" size="small">Refund {{refundDraftForAdd.amountCents | dollar}}</el-button>
      </div>
    </el-dialog>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

import _ from 'lodash'
import Order from '@/models/order'
import OrderLineItem from '@/models/order-line-item'
import Payment from '@/models/payment'
import Refund from '@/models/refund'

import OrderLineItemForm from '@/components/order-line-item-form'
import PaymentForm from '@/components/payment-form'
import RefundForm from '@/components/refund-form'

import DeleteButton from '@/components/delete-button'
import OrderLineItemTable from '@/components/order-line-item-table'
import OrderLineItemDialog from '@/components/order-line-item-dialog'
import PaymentDialog from '@/components/payment-dialog'
import RefundDialog from '@/components/refund-dialog'
import { dollar } from '@/helpers/filters'

export default {
  name: 'ShowOrder',
  filters: {
    dollar
  },
  components: {
    RefundForm,
    PaymentForm,
    OrderLineItemForm,
    DeleteButton,
    OrderLineItemDialog,
    OrderLineItemTable,
    PaymentDialog,
    RefundDialog
  },
  props: ['id'],
  data () {
    return {
      order: Order.objectWithDefaults(),
      isLoading: false,

      payments: [],

      lineItemDraftForAdd: OrderLineItem.objectWithDefaults(),
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
      errors: {},
      paymentDialogTitle: ''
    }
  },
  created () {
    this.loadOrder()
  },
  methods: {
    loadOrder () {
      this.isLoading = true

      this.$store.dispatch('order/getOrder', {
        id: this.id,
        include: 'rootLineItems.children'
      }).then(order => {
        this.order = order

        return this.$store.dispatch('order/listPayment', { orderId: order.id })
      }).then(payments => {
        this.payments = payments

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    openAddLineItemDialog () {
      let lineItem = OrderLineItem.objectWithDefaults()
      lineItem.order = this.order

      this.lineItemDraftForAdd = lineItem
      this.isAddingLineItem = true
    },

    closeAddLineItemDialog () {
      this.isAddingLineItem = false
      this.isCreatingLineItem = false
    },

    createLineItem () {
      this.isCreatingLineItem = true

      this.$store.dispatch('order/createLineItem', this.lineItemDraftForAdd).then(order => {
        this.order = order

        this.$message({
          showClose: true,
          message: `Line Item created successfully.`,
          type: 'success'
        })

        this.closeAddLineItemDialog()
      }).catch(errors => {
        this.errors = errors

        this.isCreatingLineItem = false
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

    updateLineItem (formModel) {
      this.isUpdatingLineItem = true

      this.$store.dispatch('order/updateLineItem', {
        id: this.lineItemDraftForEdit.id,
        lineItemDraft: this.lineItemDraftForEdit
      }).then(order => {
        this.order = order

        this.$message({
          showClose: true,
          message: `Line Item saved successfully.`,
          type: 'success'
        })

        this.closeEditLineItemDialog()
      }).catch(errors => {
        this.errors = errors

        this.isUpdatingLineItem = false
      })
    },

    deleteLineItem (id) {
      let orderLineItem = _.find(this.order.rootLineItems, { id: id })

      this.$store.dispatch('order/deleteLineItem', orderLineItem).then(order => {
        this.order = order
      })
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

      this.$store.dispatch('order/createPayment', this.paymentDraftForAdd).then(order => {
        this.order = order
        return this.$store.dispatch('order/listPayment', { orderId: order.id })
      }).then(payments => {
        this.payments = payments

        this.$message({
          showClose: true,
          message: `Payment created successfully.`,
          type: 'success'
        })

        this.closeAddPaymentDialog()
      }).catch(errors => {
        this.errors = errors

        this.isCreatingPayment = false
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
      this.isAddingRefund = true
    },

    closeAddRefundDialog () {
      this.isAddingRefund = false
      this.isCreatingRefund = false
    },

    createRefund () {
      this.isCreatingRefund = true

      this.$store.dispatch('order/createRefund', this.refundDraftForAdd).then(order => {
        this.order = order
        return this.$store.dispatch('order/listPayment', { orderId: order.id })
      }).then(payments => {
        this.payments = payments

        this.$message({
          showClose: true,
          message: `Refund created successfully.`,
          type: 'success'
        })

        this.closeAddRefundDialog()
      }).catch(errors => {
        this.errors = errors

        this.isCreatingRefund = false
      })
    },

    deleteOrder () {

    },

    canRefundPayment (payment) {
      return payment.status === 'partially_refunded' || payment.status === 'paid'
    },
    editRecord () {
      this.$router.push({ name: 'EditOrder', params: { id: this.order.id }, query: { callbackPath: this.currentRoutePath } })
    },
    orderDeleted () {
      this.$store.dispatch('product/resetRecord')
      this.$store.dispatch('popRoute', 1)
    },

    openEditPaymentDialog (payment) {
      let paymentDraft = _.cloneDeep(payment)

      if (paymentDraft.status === 'pending') {
        paymentDraft.status = 'paid'
      }

      paymentDraft.paidAmountCents = this.order.grandTotalCents
      this.$store.dispatch('order/startEditPayment', paymentDraft)
    },
    closeEditPaymentDialog () {
      this.$store.dispatch('order/endEditPayment')
    },
    updatePayment (formModel) {
      formModel.order = this.order
      this.$store.dispatch('order/updatePayment', { id: formModel.id, paymentDraft: formModel }).then(() => {
        this.$message({
          showClose: true,
          message: `Payment captured successfully.`,
          type: 'success'
        })
      }).catch(errors => {
        this.errors = errors
      })
    },
    deletePayment (payment) {
      this.$store.dispatch('order/deletePayment', payment).then(() => {
        this.$message({
          showClose: true,
          message: `Payment deleted successfully.`,
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
