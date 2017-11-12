<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <span>Create a Order</span>
      </div>

      <div>
        <el-steps :active="activeStep" finish-status="success" simple>
          <el-step title="Line Items"></el-step>
          <el-step title="Information"></el-step>
          <el-step title="Payment"></el-step>
        </el-steps>
      </div>

      <div class="data">
        <template v-if="activeStep === 0">
          <div class="block">
            <div class="block-body">
              <order-line-item-form v-model="lineItemDraftForCreate" :errors="errors">
              </order-line-item-form>
            </div>

            <div class="block-footer text-right">
              <el-button @click="createLineItem()" :loading="isCreatingLineItem" plain size="small">
                Add to Order
              </el-button>
            </div>
          </div>

          <div class="block">
            <div class="block-body full">
                <order-line-item-table
                  :records="order.rootLineItems"
                  @delete="deleteLineItem"
                  @edit="openLineItemDialog"
                >
                </order-line-item-table>
            </div>
          </div>

          <div id="summary" class="m-b-10">
            <div id="summary-labels" style="width: 560px; float: left;" class="text-right">
              <p>Sub Total</p>
              <p>Tax 1</p>
              <p>Tax 2</p>
              <p>Tax 3</p>
              <p><b>Grand Total</b></p>
              <p v-if="order.isEstimate"><b>Authorization Amount</b></p>
            </div>

            <div id="summary-values" style="overflow: hidden; width: 120px;" class="text-right">
              <p><span v-if="order.isEstimate">~</span> <span>{{order.subTotalCents | dollar}}</span></p>
              <p><span>{{order.taxOneCents | dollar}}</span></p>
              <p><span>{{order.taxTwoCents | dollar}}</span></p>
              <p><span>{{order.taxThreeCents | dollar}}</span></p>
              <p><span v-if="order.isEstimate">~</span> <span>{{order.grandTotalCents | dollar}}</span></p>
              <p v-if="order.isEstimate">{{order.authorizationCents | dollar}}</p>
            </div>
          </div>
        </template>

        <template v-if="activeStep === 1">
          <order-form v-model="orderDraft" :errors="errors"></order-form>
        </template>

        <template v-if="activeStep === 2">
          <payment-form v-model="paymentDraft" :record="payment" :errors="errors"></payment-form>
        </template>
      </div>

      <div class="footer">
        <template v-if="activeStep === 0">
          <el-button @click="cancel" plain size="medium">
            Cancel
          </el-button>

          <el-button :disabled="order.rootLineItems.length === 0" @click="next()" size="medium" type="primary" class="pull-right">
            Next
          </el-button>
        </template>

        <template v-if="activeStep === 1">
          <el-button @click="back" plain size="medium">
            Back
          </el-button>

          <el-button @click="updateOrder()" size="medium" type="primary" class="pull-right">
            Next
          </el-button>
        </template>

        <template v-if="activeStep === 2">
          <el-button @click="back" plain size="medium">
            Back
          </el-button>

          <el-button @click="createPayment(paymentDraft, record)" size="medium" type="primary" class="pull-right">
            Place Order
          </el-button>
        </template>
      </div>
    </el-card>
  </div>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isEditingLineItem" title="Edit Line Item" width="750px">
      <order-line-item-form v-model="lineItemDraftForEdit"></order-line-item-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingLineItem" @click="closeLineItemDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingLineItem" @click="updateLineItem()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import OrderLineItemForm from '@/components/order-line-item-form'
import PaymentForm from '@/components/payment-form'
import OrderForm from '@/components/order-form'

import Order from '@/models/order'
import OrderLineItem from '@/models/order-line-item'
import Payment from '@/models/payment'

import { dollar } from '@/helpers/filters'
import { createToken as createStripeToken } from 'vue-stripe-elements'
import errorI18nKey from '@/utils/error-i18n-key'
import OrderLineItemTable from '@/components/order-line-item-table'
import OrderLineItemDialog from '@/components/order-line-item-dialog'

export default {
  name: 'NewOrder',
  components: {
    OrderLineItemForm,
    OrderLineItemTable,
    OrderForm,
    PaymentForm,
    OrderLineItemDialog
  },
  filters: {
    dollar
  },
  data () {
    return {
      lineItemDraftForCreate: OrderLineItem.objectWithDefaults(),
      lineItemForEdit: OrderLineItem.objectWithDefaults(),
      lineItemDraftForEdit: OrderLineItem.objectWithDefaults(),

      order: Order.objectWithDefaults(),
      orderDraft: Order.objectWithDefaults(),

      paymentDraft: Payment.objectWithDefaults(),

      isCreatingLineItem: false,
      isEditingLineItem: false,
      isUpdatingLineItem: false,

      isUpdatingOrder: false,

      errors: {},
      isLoading: false,
      activeStep: 0
    }
  },
  methods: {
    createLineItem () {
      this.isCreatingLineItem = true
      this.lineItemDraftForCreate.order = this.order

      this.$store.dispatch('order/createLineItem', this.lineItemDraftForCreate).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(this.order)
        this.lineItemDraftForCreate = OrderLineItem.objectWithDefaults()

        this.isCreatingLineItem = false
      }).catch(errors => {
        this.errors = errors
        this.isCreatingLineItem = false
      })
    },
    updateLineItem () {
      this.isUpdatingLineItem = true
      this.lineItemDraftForEdit.order = this.order

      this.$store.dispatch('order/updateLineItem', {
        id: this.lineItemDraftForEdit.id,
        lineItemDraft: this.lineItemDraftForEdit
      }).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(this.order)

        this.$message({
          showClose: true,
          message: `Line Item saved successfully.`,
          type: 'success'
        })

        this.isUpdatingLineItem = false
        this.isEditingLineItem = false
      }).catch(errors => {
        this.errors = errors
        this.isUpdatingLineItem = false
      })
    },
    openLineItemDialog (lineItemId) {
      this.lineItemForEdit = _.find(this.order.rootLineItems, { id: lineItemId })
      this.lineItemDraftForEdit = _.cloneDeep(this.lineItemForEdit)

      this.isEditingLineItem = true
    },
    closeLineItemDialog () {
      this.isEditingLineItem = false
    },
    deleteLineItem (id) {
      let orderLineItem = _.find(this.order.rootLineItems, { id: id })

      this.$store.dispatch('order/deleteLineItem', orderLineItem).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(this.order)
      })
    },
    next () {
      this.activeStep += 1
    },
    updateOrder () {
      this.isUpdatingOrder = true

      this.$store.dispatch('order/updateOrder', {
        id: this.orderDraft.id,
        orderDraft: this.orderDraft
      }).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(order)

        this.paymentDraft.target = order
        this.paymentDraft.owner = order.customer

        if (order.isEstimate) {
          this.paymentDraft.authorizedAmountCents = order.authorizationCents
        } else {
          this.paymentDraft.paidAmountCents = order.grandTotalCents
        }

        this.activeStep += 1

        this.isUpdatingOrder = false
      }).catch(errors => {
        this.errors = errors

        this.$message({
          showClose: true,
          message: `Unable to continue. please fix the highlighted form errors then try again.`,
          type: 'error'
        })

        this.isUpdatingOrder = false
      })
    },
    createPayment (paymentDraft, order) {
      // this.isLoading = true

      let paymentCreated
      paymentDraft = _.cloneDeep(paymentDraft)
      if (paymentDraft.gateway === 'online') {
        if (order.isEstimate) {
          paymentDraft.authorizedAmountCents = order.authorizationCents
        } else {
          paymentDraft.paidAmountCents = order.grandTotalCents
        }

        paymentCreated = createStripeToken().then(data => {
          paymentDraft.source = data.token.id
          return this.$store.dispatch('order/createPayment', paymentDraft)
        })
      } else {
        paymentDraft = _.cloneDeep(paymentDraft)
        paymentDraft.order = order
        paymentCreated = this.$store.dispatch('order/createPayment', paymentDraft)
      }

      paymentCreated.then(payment => {
        this.$message({
          showClose: true,
          message: `Order placed successfully.`,
          type: 'success'
        })

        this.$store.dispatch('order/resetRecord')
        return this.$store.dispatch('pushRoute', { name: 'ListOrder' })
      }).catch(errors => {
        this.errors = errors
        if (errors.source) {
          let errorCode = errors.source[0]
          this.$message({
            showClose: true,
            message: this.$t(errorI18nKey('payment', 'source', errorCode)),
            type: 'error'
          })
        }
      })
    },
    cancel () {
      console.log('cancel')
    },
    back () {
      this.activeStep -= 1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-steps {
  border-radius: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.form-border {
  border: 1px solid #dfe6ec;
  padding: 20px;
}

#summary p {
  margin: 5px;
  color: #5a5e66;
  font-size: 14px;
}
</style>
