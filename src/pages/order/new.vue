<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
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
        <div v-show="activeStep === this.step.LINE_ITEMS">
          <div class="block">
            <div class="block-body">
              <order-line-item-form v-model="lineItemDraftForAdd" :errors="errors">
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
                  @edit="startEditLineItem"
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
        </div>

        <div v-show="activeStep === this.step.INFORMATION">
          <order-form v-model="orderDraft" :errors="errors"></order-form>
        </div>

        <div v-show="activeStep === this.step.PAYMENT">
          <payment-form v-model="paymentDraft" :errors="errors"></payment-form>
        </div>
      </div>

      <div class="footer">
        <el-button v-show="canCancel" @click="cancel" plain size="medium">
          Cancel
        </el-button>

        <el-button v-show="canNext" :loading="isUpdatingOrder" :disabled="order.rootLineItems.length === 0" @click="next()" size="medium" type="primary" class="pull-right">
          Next
        </el-button>

        <el-button v-show="canBack" @click="back" plain size="medium">
          Back
        </el-button>

        <el-button v-show="canPlaceOrder" :loading="isCreatingPayment" @click="createPayment()" size="medium" type="primary" class="pull-right">
          Place Order
        </el-button>
      </div>
    </el-card>
  </div>

  <div class="launchable">
    <el-dialog :show-close="false" :visible="isEditingLineItem" title="Edit Line Item" width="750px">
      <order-line-item-form v-model="lineItemDraftForEdit"></order-line-item-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingLineItem" @click="cancelEditLineItem()" plain size="small">Cancel</el-button>
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
      step: {
        LINE_ITEMS: 0,
        INFORMATION: 1,
        PAYMENT: 2
      },
      activeStep: 0,

      lineItemDraftForAdd: OrderLineItem.objectWithDefaults(),
      isCreatingLineItem: false,

      lineItemForEdit: OrderLineItem.objectWithDefaults(),
      lineItemDraftForEdit: OrderLineItem.objectWithDefaults(),
      isEditingLineItem: false,
      isUpdatingLineItem: false,

      order: Order.objectWithDefaults(),
      orderDraft: Order.objectWithDefaults(),
      isUpdatingOrder: false,

      paymentDraft: Payment.objectWithDefaults(),
      isCreatingPayment: false,

      errors: {}
    }
  },
  computed: {
    canBack () {
      return this.activeStep === this.step.INFORMATION || this.activeStep === this.step.PAYMENT
    },

    canCancel () {
      return this.activeStep === this.step.LINE_ITEMS
    },

    canNext () {
      return this.activeStep === this.step.LINE_ITEMS || this.activeStep === this.step.INFORMATION
    },

    canPlaceOrder () {
      return this.activeStep === this.step.PAYMENT
    }
  },
  methods: {
    createLineItem () {
      this.isCreatingLineItem = true
      this.lineItemDraftForAdd.order = this.order

      this.$store.dispatch('order/createLineItem', this.lineItemDraftForAdd).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(this.order)
        this.lineItemDraftForAdd = OrderLineItem.objectWithDefaults()

        this.isCreatingLineItem = false
      }).catch(errors => {
        this.errors = errors
        this.isCreatingLineItem = false
      })
    },

    startEditLineItem (lineItemId) {
      this.lineItemForEdit = _.find(this.order.rootLineItems, { id: lineItemId })
      this.lineItemDraftForEdit = _.cloneDeep(this.lineItemForEdit)

      this.isEditingLineItem = true
    },

    cancelEditLineItem () {
      this.isEditingLineItem = false
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

        this.isEditingLineItem = false
        this.isUpdatingLineItem = false
      })
    },

    deleteLineItem (id) {
      let lineItem = _.find(this.order.rootLineItems, { id: id })

      this.$store.dispatch('order/deleteLineItem', lineItem).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(this.order)
      })
    },

    next () {
      if (this.activeStep === this.step.INFORMATION) {
        this.updateOrder().then(() => {
          this.activeStep += 1
        })
      } else {
        this.activeStep += 1
      }
    },

    updateOrder () {
      this.isUpdatingOrder = true

      return this.$store.dispatch('order/updateOrder', {
        id: this.orderDraft.id,
        orderDraft: this.orderDraft,
        include: 'customer,rootLineItems.children'
      }).then(order => {
        this.order = order
        this.orderDraft = _.cloneDeep(order)

        this.paymentDraft.target = order
        this.paymentDraft.owner = order.customer

        if (order.isEstimate) {
          this.paymentDraft.amountCents = order.authorizationCents
          this.paymentDraft.capture = false
        } else {
          this.paymentDraft.amountCents = order.grandTotalCents
          this.paymentDraft.capture = true
        }

        this.isUpdatingOrder = false
      }).catch(errors => {
        this.errors = errors

        this.$message({
          showClose: true,
          message: `Unable to continue. please fix the highlighted form errors then try again.`,
          type: 'error'
        })

        this.isUpdatingOrder = false
        throw errors
      })
    },

    createPayment () {
      this.isCreatingPayment = true

      let paymentCreated

      if (this.paymentDraft.gateway === 'online') {
        paymentCreated = createStripeToken().then(data => {
          this.paymentDraft.source = data.token.id
          return this.$store.dispatch('order/createPayment', this.paymentDraft)
        })
      } else {
        paymentCreated = this.$store.dispatch('order/createPayment', this.paymentDraft)
      }

      paymentCreated.then(payment => {
        this.$message({
          showClose: true,
          message: `Order placed successfully.`,
          type: 'success'
        })

        this.isCreatingPayment = false
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

        this.isCreatingPayment = false
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
