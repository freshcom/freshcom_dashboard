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
              <order-line-item-form :order="orderDraft" :errors="errors">
              </order-line-item-form>
            </template>

            <template v-if="activeStep === 1">
              <order-form v-model="orderDraft" :errors="errors"></order-form>
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

              <el-button @click="nextStep(orderDraft)" type="primary" class="pull-right">
                Next
              </el-button>
            </template>

            <template v-if="activeStep === 1">
              <el-button @click="back">
                Back
              </el-button>

              <el-button @click="nextStep(orderDraft)" type="primary" class="pull-right">
                Next
              </el-button>
            </template>

            <template v-if="activeStep === 2">
              <el-button @click="back">
                Back
              </el-button>

              <el-button @click="createPayment(paymentDraft, order)" type="primary" class="pull-right">
                Place Order
              </el-button>
            </template>

          </div>
        </el-card>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import OrderLineItemForm from '@/components/order-line-item-form'
import PaymentForm from '@/components/payment-form'
import OrderForm from '@/components/order-form'
import { createToken as createStripeToken } from 'vue-stripe-elements'

export default {
  name: 'NewOrder',
  components: {
    OrderLineItemForm,
    OrderForm,
    PaymentForm
  },
  data () {
    return {
      errors: {},
      isLoading: false,
      activeStep: 0
    }
  },
  computed: {
    submitText () {
      if (this.activeStep === 0) {
        return 'Next'
      }

      return 'Place Order'
    },
    orderDraft: {
      get () {
        return this.$store.state.order.recordDraft
      },
      set (value) {
        this.$store.dispatch(`order/setRecordDraft`, value)
      }
    },
    order () {
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
    nextStep (orderDraft) {
      if (this.activeStep === 0) {
        this.activeStep += 1
        return
      }

      if (this.activeStep === 1) {
        this.isLoading = true
        this.$store.dispatch('order/updateRecord', { id: orderDraft.id, recordDraft: orderDraft }).then(order => {
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
    createPayment () {
      createStripeToken().then(data => console.log(data.token))
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
</style>
