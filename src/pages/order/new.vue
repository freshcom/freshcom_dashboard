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
          <div v-loading="isLineItemLoading" class="block">
            <div class="block-body">
              <order-line-item-form v-model="lineItemDraftForCreate" :errors="errors">
              </order-line-item-form>
            </div>

            <div class="block-footer text-right">
              <el-button @click="createLineItem(lineItemDraftForCreate)" :loading="isSubmittingLineItemForCreate" plain size="small">
                Add to Order
              </el-button>
            </div>
          </div>

          <div class="block">
            <div class="block-body full">
                <order-line-item-table
                  :records="record.rootLineItems"
                  @delete="deleteLineItem"
                  @edit="editLineItem"
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
              <p v-if="record.isEstimate"><b>Authorization Amount</b></p>
            </div>

            <div id="summary-values" style="overflow: hidden; width: 120px;" class="text-right">
              <p><span v-if="record.isEstimate">~</span> <span>{{record.subTotalCents | dollar}}</span></p>
              <p><span>{{record.taxOneCents | dollar}}</span></p>
              <p><span>{{record.taxTwoCents | dollar}}</span></p>
              <p><span>{{record.taxThreeCents | dollar}}</span></p>
              <p><span v-if="record.isEstimate">~</span> <span>{{record.grandTotalCents | dollar}}</span></p>
              <p v-if="record.isEstimate">{{record.authorizationCents | dollar}}</p>
            </div>
          </div>
        </template>

        <template v-if="activeStep === 1">
          <order-form v-model="recordDraft" :errors="errors"></order-form>
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

          <el-button :disabled="record.rootLineItems.length === 0" @click="next()" size="medium" type="primary" class="pull-right">
            Next
          </el-button>
        </template>

        <template v-if="activeStep === 1">
          <el-button @click="back" plain size="medium">
            Back
          </el-button>

          <el-button @click="updateOrder(recordDraft, paymentDraft)" size="medium" type="primary" class="pull-right">
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
    <order-line-item-dialog
      v-model="lineItemDraftForUpdate"
      :is-visible="isEditingLineItem"
      @save="saveLineItem"
      @cancel="closeLineItemDialog"
      title="Edit Line Item"
    >

    </order-line-item-dialog>
  </div>

</div>
</template>

<script>
import _ from 'lodash'
import OrderLineItemForm from '@/components/order-line-item-form'
import PaymentForm from '@/components/payment-form'
import OrderForm from '@/components/order-form'
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
  created () {
    this.$store.dispatch('order/resetRecord')
  },
  data () {
    return {
      errors: {},
      isLoading: false,
      activeStep: 0
    }
  },
  computed: {
    isSubmittingLineItemForCreate () {
      return this.$store.state.order.isSubmittingLineItemForCreate
    },
    isEditingLineItem () {
      return this.$store.state.order.isEditingLineItem
    },
    submitText () {
      if (this.activeStep === 0) {
        return 'Next'
      }

      return 'Place Order'
    },
    isLineItemLoading () {
      return this.$store.state.orderLineItem.isRecordLoading
    },
    lineItemDraftForCreate: {
      get () {
        return this.$store.state.order.lineItemDraftForCreate
      },
      set (value) {
        this.$store.dispatch(`order/setLineItemDraftForCreate`, value)
      }
    },
    lineItemDraftForUpdate: {
      get () {
        return this.$store.state.order.lineItemDraftForUpdate
      },
      set (value) {
        this.$store.dispatch(`order/setLineItemDraftForUpdate`, value)
      }
    },
    recordDraft: {
      get () {
        return this.$store.state.order.recordDraft
      },
      set (value) {
        this.$store.dispatch(`order/setRecordDraft`, value)
      }
    },
    record () {
      return this.$store.state.order.record
    },
    payment () {
      return this.$store.state.order.paymentForCreate
    },
    paymentDraft: {
      get () {
        return this.$store.state.order.paymentDraftForCreate
      },
      set (value) {
        console.log(value)
        this.$store.dispatch(`order/setPaymentDraftForCreate`, value)
      }
    }
  },
  methods: {
    updateOrder (recordDraft, payment) {
      this.$store.dispatch('order/updateRecord', {
        id: recordDraft.id,
        recordDraft: recordDraft
      }).then(order => {
        let payment = _.cloneDeep(this.payment)
        payment.target = order
        payment.owner = order.customer

        if (order.isEstimate) {
          payment.authorizedAmountCents = order.authorizationCents
        } else {
          payment.paidAmountCents = order.grandTotalCents
        }

        this.$store.dispatch('order/setPaymentForCreate', payment)

        this.activeStep += 1
      }).catch(errors => {
        this.errors = errors

        this.$message({
          showClose: true,
          message: `Unable to continue. please fix the highlighted form errors then try again.`,
          type: 'error'
        })
      })
    },
    next () {
      this.activeStep += 1
    },
    editLineItem (lineItemId) {
      let lineItem = _.find(this.record.rootLineItems, { id: lineItemId })
      this.$store.dispatch('order/startEditLineItem', _.cloneDeep(lineItem))
    },
    createLineItem (lineItemDraft) {
      lineItemDraft.order = this.record
      this.$store.dispatch('order/createLineItem', lineItemDraft)
    },
    saveLineItem (formModel) {
      formModel.order = this.record
      this.$store.dispatch('order/updateLineItem', { id: formModel.id, lineItemDraft: formModel }).then(() => {
        this.$message({
          showClose: true,
          message: `Line Item saved successfully.`,
          type: 'success'
        })
      })
    },
    deleteLineItem (id) {
      let orderLineItem = _.find(this.record.rootLineItems, { id: id })
      orderLineItem = _.cloneDeep(orderLineItem)
      orderLineItem.order = this.record
      this.$store.dispatch('order/deleteLineItem', orderLineItem)
    },
    closeLineItemDialog () {
      this.$store.dispatch('order/endEditLineItem')
    },
    createPayment (paymentDraft, order) {
      // this.isLoading = true

      let paymentCreated
      paymentDraft = _.cloneDeep(paymentDraft)
      paymentDraft.owner = { id: order.id, type: order.type }
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

        console.log('x')
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
