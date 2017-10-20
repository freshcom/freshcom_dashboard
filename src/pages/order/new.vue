<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/orders" mode="horizontal">
        <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">
            <span style="line-height: 36px;">Create a Order</span>
          </div>

          <div class="step-indicator">
            <el-steps :space="200" :active="activeStep" :align-center="true" finish-status="success">
              <el-step title="Line Items"></el-step>
              <el-step title="Information"></el-step>
              <el-step title="Payment"></el-step>
            </el-steps>
          </div>

          <div class="data">
            <template v-if="activeStep === 0">
              <div v-loading="isLineItemLoading" class="m-b-20 form-border">
                <order-line-item-form v-model="lineItemDraftForCreate" :errors="errors">
                </order-line-item-form>

                <div class="text-right">
                  <el-button @click="createLineItem(lineItemDraftForCreate)">
                    Save Line Item
                  </el-button>
                </div>
              </div>

              <div class="m-b-20">
                <order-line-item-table @delete="deleteLineItem" @edit="editLineItem" :records="record.rootLineItems">
                </order-line-item-table>
              </div>

              <div id="summary">
                <div id="summary-labels" style="width: 490px; float: left;" class="text-right">
                  <p v-if="record.subTotalCents">Sub Total</p>
                  <p v-if="record.taxOneCents">Tax 1</p>
                  <p v-if="record.taxTwoCents">Tax 2</p>
                  <p v-if="record.taxThreeCents">Tax 3</p>
                  <p v-if="record.grandTotalCents"><b>Grand Total</b></p>
                  <p v-if="record.isEstimate"><b>Authorization Amount</b></p>
                </div>

                <div id="summary-values" style="overflow: hidden; width: 103px;" class="text-right">
                  <p v-if="record.subTotalCents"><span v-if="record.isEstimate">~</span> <span>{{record.subTotalCents | dollar}}</span></p>
                  <p v-if="record.taxOneCents"><span>{{record.taxOneCents | dollar}}</span></p>
                  <p v-if="record.taxTwoCents"><span>{{record.taxTwoCents | dollar}}</span></p>
                  <p v-if="record.taxThreeCents"><span>{{record.taxThreeCents | dollar}}</span></p>
                  <p v-if="record.grandTotalCents"><span v-if="record.isEstimate">~</span> <span>{{record.grandTotalCents | dollar}}</span></p>
                  <p v-if="record.isEstimate">{{record.authorizationCents | dollar}}</p>
                </div>
              </div>
            </template>

            <template v-if="activeStep === 1">
              <order-form v-model="recordDraft" :errors="errors"></order-form>
            </template>

            <template v-if="activeStep === 2">
              <payment-form v-model="paymentDraft" :errors="errors"></payment-form>
            </template>
          </div>

          <div class="footer">
            <template v-if="activeStep === 0">
              <el-button @click="cancel">
                Cancel
              </el-button>

              <el-button @click="nextStep(recordDraft)" type="primary" class="pull-right">
                Next
              </el-button>
            </template>

            <template v-if="activeStep === 1">
              <el-button @click="back">
                Back
              </el-button>

              <el-button @click="nextStep(recordDraft)" type="primary" class="pull-right">
                Next
              </el-button>
            </template>

            <template v-if="activeStep === 2">
              <el-button @click="back">
                Back
              </el-button>

              <el-button @click="createPayment(paymentDraft, record)" type="primary" class="pull-right">
                Place Order
              </el-button>
            </template>
          </div>
        </el-card>
      </div>
    </div>
    <div class="launchable">
      <order-line-item-dialog
        v-model="lineItemDraftForUpdate"
        @save="saveLineItem"
        @cancel="closeLineItemDialog"
        :is-visible="isEditingLineItem"
      >

      </order-line-item-dialog>
    </div>
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
    paymentDraft: {
      get () {
        return this.$store.state.payment.recordDraft
      },
      set (value) {
        this.$store.dispatch(`payment/setRecordDraft`, value)
      }
    }
  },
  methods: {
    nextStep (recordDraft) {
      if (this.activeStep === 0) {
        this.activeStep += 1
        return
      }

      if (this.activeStep === 1) {
        this.isLoading = true
        this.$store.dispatch('order/updateRecord', { id: recordDraft.id, recordDraft: recordDraft }).then(order => {
          let paymentDraft = _.cloneDeep(this.paymentDraft)
          paymentDraft.order = order
          this.$store.dispatch('payment/setRecordDraft', paymentDraft)
          this.isLoading = false
          this.activeStep += 1
        }).catch(errors => {
          this.errors = errors
          this.isLoading = false

          this.$message({
            showClose: true,
            message: `Unable to continue. please fix the highlighted form errors then try again.`,
            type: 'error'
          })
        })
      }
    },
    editLineItem (lineItemId) {
      let lineItem = _.find(this.record.rootLineItems, { id: lineItemId })
      this.$store.dispatch('order/startLineItemEdit', _.cloneDeep(lineItem))
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
      this.$store.dispatch('order/endLineItemEdit')
    },
    createPayment (paymentDraft, order) {
      this.isLoading = true

      let paymentCreated
      if (paymentDraft.gateway === 'online' && paymentDraft.status === 'paid') {
        paymentCreated = createStripeToken().then(data => {
          paymentDraft = _.cloneDeep(paymentDraft)
          paymentDraft.order = order
          paymentDraft.source = data.token.id
          return this.$store.dispatch('payment/createRecord', paymentDraft)
        })
      } else {
        paymentDraft.order = order
        paymentCreated = this.$store.dispatch('payment/createRecord', paymentDraft)
      }

      paymentCreated.then(payment => {
        this.$message({
          showClose: true,
          message: `Order placed successfully.`,
          type: 'success'
        })

        this.isLoading = false
        this.$store.dispatch('order/resetRecord')
        return this.$store.dispatch('pushRoute', { name: 'ListOrder' })
      }).catch(errors => {
        this.isLoading = false
        if (errors.source) {
          let errorCode = errors.source[0]
          this.$message({
            showClose: true,
            duration: 0,
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
.step-indicator {
  margin-left: 175px;
  margin-top: 20px;
}

.form-border {
  border: 1px solid #dfe6ec;
  padding: 20px;
}
</style>
