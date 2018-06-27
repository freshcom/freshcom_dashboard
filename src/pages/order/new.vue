<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'NewOrder' }">Orders</router-link>
  </div>

  <div slot="card-header">
    <h1>Create an order</h1>

    <div class="pull-right">
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
  </div>

  <div slot="card-content">
    <div class="steps">
      <el-steps :active="activeStep" finish-status="success" simple>
        <el-step title="Items"></el-step>
        <el-step title="Information"></el-step>
        <el-step title="Payment"></el-step>
      </el-steps>
    </div>

    <div class="data">
      <div v-show="activeStep === this.step.LINE_ITEMS">
        <div class="block">
          <el-form @submit.native.prevent="createLineItem()" label-position="top" size="small">
            <div class="body full">
              <order-line-item-fieldset v-model="lineItemForAdd" :errors="errors" class="fieldset">
              </order-line-item-fieldset>

              <div class="foot text-right">
                <el-button :loading="isCreatingLineItem" native-type="submit" plain size="small" id="add-to-order">Add to order</el-button>
              </div>
            </div>
          </el-form>
        </div>

        <div class="block">
          <div class="body full">
            <order-line-item-table :records="order.rootLineItems" @delete="deleteLineItem($event)" @edit="editLineItem($event)">
            </order-line-item-table>
          </div>
        </div>

        <div class="order-summary">
          <el-row>
            <el-col :span="9" :offset="15">
              <dl>
                <template v-if="order.subTotalCents !== order.grandTotalCents">
                  <dt>Subtotal</dt>
                  <dd>{{order.subTotalCents | dollar}}</dd>
                </template>

                <template v-if="order.taxOneCents">
                  <dt>Tax 1</dt>
                  <dd>{{order.taxOneCents | dollar}}</dd>
                </template>

                <template v-if="order.taxTwoCents">
                  <dt>Tax 2</dt>
                  <dd>{{order.taxTwoCents | dollar}}</dd>
                </template>

                <template v-if="order.taxThreeCents">
                  <dt>Tax 3</dt>
                  <dd>{{order.taxThreeCents | dollar}}</dd>
                </template>

                <dt class="total">Total</dt>
                <dd class="total">{{order.grandTotalCents | dollar}}</dd>
              </dl>
            </el-col>
          </el-row>
        </div>
      </div>

      <div v-show="activeStep === this.step.INFORMATION">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form @submit.native.prevent="submit()" label-width="140px" size="small">
              <order-fieldset v-model="orderDraft" :errors="errors"></order-fieldset>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <div v-show="activeStep === this.step.PAYMENT">
        <div class="block">
          <div class="body full">
            <order-line-item-table :records="order.rootLineItems" @delete="deleteLineItem($event)" @edit="editLineItem($event)">
            </order-line-item-table>
          </div>
        </div>

        <div class="order-summary">
          <el-row>
            <el-col :span="9" :offset="15">
              <dl>
                <template v-if="order.subTotalCents !== order.grandTotalCents">
                  <dt>Subtotal</dt>
                  <dd>{{order.subTotalCents | dollar}}</dd>
                </template>

                <template v-if="order.taxOneCents">
                  <dt>Tax 1</dt>
                  <dd>{{order.taxOneCents | dollar}}</dd>
                </template>

                <template v-if="order.taxTwoCents">
                  <dt>Tax 2</dt>
                  <dd>{{order.taxTwoCents | dollar}}</dd>
                </template>

                <template v-if="order.taxThreeCents">
                  <dt>Tax 3</dt>
                  <dd>{{order.taxThreeCents | dollar}}</dd>
                </template>

                <dt class="total">Total</dt>
                <dd class="total">{{order.grandTotalCents | dollar}}</dd>
              </dl>
            </el-col>
          </el-row>
        </div>

        <hr/>

        <el-row>
          <el-col :span="20" :offset="2">
            <div class="block">
              <div class="body">
                <el-form @submit.native.prevent="submit()" label-width="110px" size="small">
                  <payment-fieldset v-model="paymentDraft" :errors="errors"></payment-fieldset>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="foot text-right">
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
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isEditingLineItem" title="Edit line item" width="750px">
      <el-form @submit.native.prevent="updateLineItem()" label-position="top" size="small">
        <order-line-item-fieldset v-model="lineItemForEdit" :errors="errors"></order-line-item-fieldset>
      </el-form>

      <div slot="footer">
        <el-button :disabled="isUpdatingLineItem" @click="cancelEditLineItem()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingLineItem" @click="updateLineItem()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
<!-- <div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/orders" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

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
              <order-line-item-form v-model="lineItemForAdd" :errors="errors">
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
              <p v-if="order.isEstimate">{{order.authorizationTotalCents | dollar}}</p>
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
      <order-line-item-form v-model="lineItemForEdit"></order-line-item-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingLineItem" @click="cancelEditLineItem()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingLineItem" @click="updateLineItem()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>

</div> -->
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import OrderLineItemFieldset from '@/components/order-line-item-fieldset'
import PaymentFieldset from '@/components/payment-fieldset'
import OrderFieldset from '@/components/order-fieldset'

import Order from '@/models/order'
import OrderLineItem from '@/models/order-line-item'
import Payment from '@/models/payment'

import PageMixin from '@/mixins/page'
import { dollar } from '@/helpers/filters'
import { createToken as createStripeToken } from 'vue-stripe-elements-plus'
import translateErrors from '@/helpers/translate-errors'
import OrderLineItemTable from '@/components/order-line-item-table'

export default {
  name: 'NewOrder',
  mixins: [PageMixin],
  components: {
    OrderLineItemFieldset,
    OrderLineItemTable,
    OrderFieldset,
    PaymentFieldset
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

      lineItemForAdd: OrderLineItem.objectWithDefaults(),
      isCreatingLineItem: false,

      lineItemForEdit: OrderLineItem.objectWithDefaults(),
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

      if (this.order.authorizationTotalCents !== this.order.grandTotalCents) {
        tableData.push({
          name: 'Authorization total',
          valueCents: this.order.authorizationTotalCents
        })
      }

      return tableData
    }
  },
  methods: {
    loadOrder (id) {
      return freshcom.retrieveOrder(id, {
        include: 'rootLineItems.children,customer'
      }).then(response => {
        this.order = response.data
        this.orderDraft = _.clone(response.data)
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
        this.lineItemForAdd.order = order
        return freshcom.createOrderLineItem(order.id, this.lineItemForAdd)
      }).then(response => {
        return this.loadOrder(response.data.order.id)
      }).then(() => {
        this.lineItemForAdd = OrderLineItem.objectWithDefaults()
        this.isCreatingLineItem = false
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingLineItem = false
      })
    },

    editLineItem (lineItemId) {
      let targetLineItem = _.find(this.order.rootLineItems, { id: lineItemId })
      this.lineItemForEdit = _.clone(targetLineItem)

      this.isEditingLineItem = true
    },

    cancelEditLineItem () {
      this.isEditingLineItem = false
    },

    updateLineItem () {
      this.isUpdatingLineItem = true
      this.lineItemForEdit.order = this.order

      freshcom.updateOrderLineItem(this.lineItemForEdit.id, this.lineItemForEdit).then(() => {
        return this.loadOrder(this.order.id)
      }).then(() => {
        this.paymentDraft = _.merge({}, this.paymentDraft, { amountCents: this.order.grandTotalCents })

        this.$message({
          showClose: true,
          message: `Line item saved successfully.`,
          type: 'success'
        })

        this.isUpdatingLineItem = false
        this.cancelEditLineItem()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingLineItem = false
        throw response
      })
    },

    deleteLineItem (id) {
      freshcom.deleteOrderLineItem(id).then(() => {
        return this.loadOrder(this.order.id)
      }).then(() => {
        this.paymentDraft = _.merge({}, this.paymentDraft, { amountCents: this.order.grandTotalCents })

        this.$message({
          showClose: true,
          message: `Line item deleted successfully.`,
          type: 'success'
        })
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
        this.orderDraft = _.clone(order)

        let paymentDraft = _.clone(this.paymentDraft)
        paymentDraft.target = order
        paymentDraft.owner = order.customer

        if (order.isEstimate) {
          paymentDraft.amountCents = order.authorizationTotalCents
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
      if (this.paymentDraft.gateway === 'freshcom' && this.paymentDraft.useCardFrom === 'newCard') {
        paymentCreated = createStripeToken().then(response => {
          if (response.error) { throw response }
          this.paymentDraft.source = response.token.id
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
<style lang="scss" scoped>
.fieldset {
  margin: 0 20px;
}

.order-summary {
  margin-bottom: 20px;

  .total {
    font-size: 18px;
    font-weight: 500;
  }

  dd {
    text-align: right;
  }
}

.el-steps {
  border-radius: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.form-border {
  border: 1px solid #dfe6ec;
  padding: 20px;
}
</style>
