<template>
<el-form @input.native="updateValue" label-position="top" size="small" class="m-b-10">

  <el-row :gutter="10">
    <el-col v-if="canSelectGateway" :span="8">
      <el-form-item label="Gateway" :error="errorMessages.gateway" required>
        <el-select @change="updateValue" v-model="formModel.gateway">
          <el-option label="Online" value="online"></el-option>
          <el-option label="Offline" value="offline"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item v-if="canSelectStatus" label="Status" :error="errorMessages.status" required>
        <el-select @change="updateValue" v-model="formModel.status">
          <el-option label="Pending" value="pending"></el-option>
          <el-option label="Paid" value="paid"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="canSelectProcessor" label="Processor" :error="errorMessages.processor" required>
        <el-select @change="updateValue" v-model="formModel.processor">
          <el-option label="Stripe" value="stripe"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item v-if="formModel.gateway === 'offline' && formModel.status === 'paid'" label="Method" :error="errorMessages.method" required>
        <el-select @change="updateValue" v-model="formModel.method">
          <el-option label="Credit" value="credit"></el-option>
          <el-option label="Debit" value="debit"></el-option>
          <el-option label="Cash" value="cash"></el-option>
          <el-option label="Cheque" value="cheque"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item v-if="canEnterPaidAmount" :error="errorMessages.paidAmountCents" label="Paid Amount" class="paid-amount">
        <money-input v-model="formModel.paidAmountCents"></money-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="12">
      <el-form-item v-if="canSelectAction" :error="errorMessages.status" required>
        <b class="m-r-20">Action</b>
        <el-radio-group @change="updateValue" v-model="formModel.status">
          <el-radio label="paid">Pay Now</el-radio>
          <el-radio label="pending">Pay through Paylink</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-col>
    <el-col :span="12">

    </el-col>
  </el-row>

  <el-row>
    <el-form-item v-if="canEnterCaptureAmount" :error="errorMessages.paidAmountCents" label="Capture Amount" class="capture-amount">
      <money-input v-model="formModel.paidAmountCents"></money-input>
    </el-form-item>
  </el-row>

  <template v-if="canEnterCreditCard">
    <hr>
    <el-row>
      <el-col :span="12">
        <el-form-item class="card-from" required>
          <b class="m-r-20">Card</b>
          <el-radio-group v-model="useCardFrom">
            <el-radio v-if="orderHasCustomer" label="savedCard">Select from saved cards</el-radio>
            <el-radio label="newCard">Enter a new card</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="useCardFrom === 'newCard'">
      <el-col :span="12">
        <el-form-item class="card" required>
          <card class="stripe-card" :class="{ complete }" :stripe="stripePk" :options="stripeOptions" @change="complete = $event.complete"></card>
        </el-form-item>
      </el-col>
    </el-row>
     <el-row v-if="useCardFrom === 'newCard' && orderHasCustomer">
      <el-col :span="12">
        <el-form-item class="card" required>
          <el-checkbox v-model="formModel.saveSource">Save this card</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="useCardFrom === 'savedCard'">
      <el-col :span="12">
        <el-form-item class="card" required>
          <el-select @change="updateValue" v-model="formModel.source" class="full">
            <el-option v-for="card in selectableCards" :key="card.id" :label="`${card.brand} ****${card.lastFourDigit}`" :value="card.stripeCardId">
              <span>{{card.brand}} ****{{card.lastFourDigit}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="formModel.gateway === 'online' && formModel.order && formModel.order.fulfillmentMethod === 'ship'">
      <el-form-item label="Billing Address" :error="errorMessages.status" required>
        <el-radio-group @change="updateValue" v-model="isBillingAndShippingAddressSame">
          <el-radio :label="false">Enter new address</el-radio>
          <el-radio :label="true">Same as shipping address</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>

    <template v-if="canEnterBillingAddress">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Street Address 1" :error="errorMessages.billingAddressLineOne" required>
            <el-input v-model="formModel.billingAddressLineOne"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Street Address 2" :error="errorMessages.billingAddressLineTwo">
            <el-input v-model="formModel.billingAddressLineTwo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="City" :error="errorMessages.billingAddressCity" required>
            <el-input v-model="formModel.billingAddressCity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Province" :error="errorMessages.billingAddressProvince" required>
            <el-input v-model="formModel.billingAddressProvince"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Country" :error="errorMessages.billingAddressCountryCode" required>
            <el-input v-model="formModel.billingAddressCountryCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Postal Code" :error="errorMessages.billingAddressPostalCode" required>
            <el-input v-model="formModel.billingAddressPostalCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
  </template>

</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'
import MoneyInput from '@/components/money-input'
import { Card } from 'vue-stripe-elements'
import { STRIPE_PUBLISHABLE_KEY } from '@/env'

export default {
  name: 'PaymentForm',
  props: ['value', 'errors', 'record'],
  components: {
    Card,
    MoneyInput
  },
  data () {
    return {
      complete: false,
      formModel: _.cloneDeep(this.value),
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      stripePk: STRIPE_PUBLISHABLE_KEY,
      isBillingAndShippingAddressSame: false,
      useCardFrom: 'newCard'
    }
  },
  created () {
    if (this.record.order && this.record.order.customer) {
      this.$store.dispatch('payment/loadSelectableCards', { customerId: this.record.order.customer.id }).then(response => {
        let cards = response.resources
        if (cards.length > 0) {
          this.useCardFrom = 'savedCard'
          let primaryCard = _.find(cards, { primary: true })
          this.formModel.source = primaryCard.stripeCardId
          this.updateValue()
        }
      })
    }
  },
  computed: {
    orderHasCustomer () {
      return !!this.record.order.customer
    },
    selectableCards () {
      return this.$store.state.payment.selectableCards
    },
    isLoadingSelectableCards () {
      return this.$store.state.payment.isLoadingSelectableCards
    },
    canSelectStatus () {
      return !this.record.id && this.formModel.gateway === 'offline'
    },
    canEnterPaidAmount () {
      return this.record.id && this.formModel.gateway === 'offline' && this.formModel.status === 'paid'
    },
    canEnterCaptureAmount () {
      return this.record.id && this.record.status === 'authorized'
    },
    canEnterCreditCard () {
      return !this.record.id && this.formModel.gateway === 'online' && this.formModel.status === 'paid'
    },
    canSelectProcessor () {
      return !this.record.id && this.formModel.gateway === 'online'
    },
    canSelectAction () {
      return !this.record.id && this.formModel.gateway === 'online'
    },
    canSelectGateway () {
      return !this.record.id
    },
    canEnterBillingAddress () {
      if (this.formModel.order && this.formModel.order.fulfillmentMethod === 'ship' && this.isBillingAndShippingAddressSame) {
        return false
      }

      return true
    },
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('Payment', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    record (record) {
      console.log(record)
      if (record.order && record.order.customer) {
        this.$store.dispatch('payment/loadSelectableCards', { customer_id: record.order.customer.id })
      }
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-form-item {
  margin: 10px 0;
}

.card {
  margin-top: 0px;
}

.card-from {
  margin-bottom: 0px;
}

.full {
  width: 100%;
}

.stripe-card {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  height: 32px;
  line-height: 24px;
  outline: 0;
  padding: 4px 10px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
</style>
