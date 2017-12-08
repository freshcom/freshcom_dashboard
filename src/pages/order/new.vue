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
        <span>Create an order</span>
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
          <order-form v-model="orderDraft" :errors="errors" :can-select-customer="!this.customerId"></order-form>
        </div>

        <div v-show="activeStep === this.step.PAYMENT">
          <el-row>
            <el-col :span="8" :offset="8">
              <p v-if="order.customer" class="text-right">
                <el-button plain size="mini">Use Points</el-button>
              </p>

              <div class="block">
                <div class="block-body full">
                  <el-table :data="summaryTableData" class="block-table" :show-header="false">
                    <el-table-column width="150px">
                      <template slot-scope="scope">
                        {{scope.row.name}}
                      </template>
                    </el-table-column>

                    <el-table-column align="right">
                      <template slot-scope="scope">
                        <span>{{scope.row.valueCents | dollar}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </el-row>
          <hr/>
          <payment-form v-model="paymentDraft" :errors="errors"></payment-form>
        </div>
      </div>

      <div class="footer">
        <el-button v-show="canCancel" @click="cancel" plain size="small">
          Cancel
        </el-button>

        <el-button v-show="canNext" :loading="isUpdatingOrder" :disabled="order.rootLineItems.length === 0" @click="next()" size="small" type="primary" class="pull-right">
          Next
        </el-button>

        <el-button v-show="canBack" @click="back" plain size="small">
          Back
        </el-button>

        <el-button v-show="canPlaceOrder" :loading="isCreatingPayment" @click="createPayment()" size="small" type="primary" class="pull-right">
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
import freshcom from '@/freshcom-sdk'

import OrderLineItemForm from '@/components/order-line-item-form'
import PaymentForm from '@/components/payment-form'
import OrderForm from '@/components/order-form'

import Order from '@/models/order'
import OrderLineItem from '@/models/order-line-item'
import Payment from '@/models/payment'

import { dollar } from '@/helpers/filters'
import { createToken as createStripeToken } from 'vue-stripe-elements-plus'
import translateErrors from '@/helpers/translate-errors'
import OrderLineItemTable from '@/components/order-line-item-table'

export default {
  name: 'NewOrder',
  components: {
    OrderLineItemForm,
    OrderLineItemTable,
    OrderForm,
    PaymentForm
  },
  filters: {
    dollar
  },
  props: ['customerId'],
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

      order: Order.objectWithDefaults({
        customer: { id: this.customerId, type: 'Customer' }
      }),
      orderDraft: Order.objectWithDefaults({
        customer: { id: this.customerId, type: 'Customer' }
      }),
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
    },

    summaryTableData () {
      let tableData = []

      if (this.order.subTotalCents !== this.order.grandTotalCents) {
        tableData.push({
          name: 'Sub total',
          valueCents: this.order.subTotalCents
        })
      }

      let taxTotalCents = this.order.taxOneCents + this.order.taxTwoCents + this.order.taxThreeCents
      if (taxTotalCents > 0) {
        tableData.push({
          name: 'Tax total',
          valueCents: taxTotalCents
        })
      }

      tableData.push({
        name: 'Grand total',
        valueCents: this.order.grandTotalCents
      })

      if (this.order.authorizationCents !== this.order.grandTotalCents) {
        tableData.push({
          name: 'Authorization total',
          valueCents: this.order.authorizationCents
        })
      }

      return tableData
    }
  },
  methods: {
    loadOrder (id) {
      freshcom.retrieveOrder(id, {
        include: 'rootLineItems.children,customer'
      }).then(response => {
        this.order = response.data
        this.orderDraft = _.cloneDeep(response.data)
        return response
      })
    },

    createLineItem () {
      this.isCreatingLineItem = true

      let orderCreated = new Promise((resolve, reject) => {
        resolve(this.order)
      })
      if (!this.order.id) {
        orderCreated = freshcom.createOrder(this.order).then(response => {
          return response.data
        })
      }

      orderCreated.then(order => {
        this.lineItemDraftForAdd.order = order
        return freshcom.createOrderLineItem(order.id, this.lineItemDraftForAdd)
      }).then(response => {
        return this.loadOrder(response.data.order.id)
      }).then(() => {
        this.lineItemDraftForAdd = OrderLineItem.objectWithDefaults()
        this.isCreatingLineItem = false
      }).catch(response => {
        this.errors = response.errors
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

      freshcom.updateOrderLineItem(this.lineItemDraftForEdit.id, this.lineItemDraftForEdit).then(() => {
        return this.loadOrder(this.order.id)
      }).then(() => {
        this.$message({
          showClose: true,
          message: `Line Item saved successfully.`,
          type: 'success'
        })

        this.isUpdatingLineItem = false
        this.isEditingLineItem = false
      }).catch(response => {
        this.errors = response.errors
        this.isEditingLineItem = false
        this.isUpdatingLineItem = false
        throw response
      })
    },

    deleteLineItem (id) {
      freshcom.deleteOrderLineItem(id).then(() => {
        return this.loadOrder(this.order.id)
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

      return freshcom.updateOrder(this.order.id, this.orderDraft, {
        include: 'customer,rootLineItems.children'
      }).then(response => {
        let order = response.data
        this.order = order
        this.orderDraft = _.cloneDeep(order)

        let paymentDraft = _.cloneDeep(this.paymentDraft)
        paymentDraft.target = order
        paymentDraft.owner = order.customer

        if (order.isEstimate) {
          paymentDraft.amountCents = order.authorizationCents
          paymentDraft.capture = false
        } else {
          paymentDraft.amountCents = order.grandTotalCents
          paymentDraft.capture = true
        }

        this.paymentDraft = paymentDraft
        this.isUpdatingOrder = false
      }).catch(response => {
        this.errors = response.errors

        this.$message({
          showClose: true,
          message: `Unable to continue. please fix the highlighted form errors then try again.`,
          type: 'error'
        })

        this.isUpdatingOrder = false
        throw response
      })
    },

    createPayment () {
      this.isCreatingPayment = true

      let paymentCreated
      if (this.paymentDraft.gateway === 'online' && this.paymentDraft.useCardFrom === 'newCard') {
        paymentCreated = createStripeToken().then(data => {
          this.paymentDraft.source = data.token.id
          return freshcom.createPayment(this.paymentDraft)
        })
      } else {
        paymentCreated = freshcom.createPayment(this.paymentDraft)
      }

      paymentCreated.then(() => {
        this.$message({
          showClose: true,
          message: `Order placed successfully.`,
          type: 'success'
        })

        this.isCreatingPayment = false
        return this.$store.dispatch('pushRoute', { name: 'ListOrder' })
      }).catch(response => {
        this.errors = response.errors
        let translatedErrors = translateErrors(this.errors, 'payment')
        if (this.errors.source) {
          this.$message({
            showClose: true,
            message: translatedErrors.source,
            type: 'error'
          })
        }

        this.isCreatingPayment = false
        throw response
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
