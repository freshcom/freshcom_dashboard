<template>
<div class="component-wrapper payment-fieldset">
  <el-row :gutter="10">
    <el-col :span="12">
      <el-form-item :error="errorMsgs.amountCents" label="Pay Amount" class="amount" required>
        <money-input v-model="formModel.amountCents" @input="updateValue()"></money-input>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row :gutter="10">
    <el-col :span="10">
      <el-form-item :error="errorMsgs.gateway" label="Gateway" required>
        <el-select @change="updateValue()" v-model="formModel.gateway">
          <el-option label="Freshcom" value="freshcom"></el-option>
          <el-option label="Custom" value="custom"></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="7">
      <el-form-item v-if="canSelectStatus" label="Status" :error="errorMsgs.status" label-width="60px" required>
        <el-select @change="updateValue()" v-model="formModel.status">
          <el-option label="Pending" value="pending"></el-option>
          <el-option label="Paid" value="paid"></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="7">
      <el-form-item v-if="formModel.gateway === 'custom' && formModel.status === 'paid'" label="Method" label-width="70px" :error="errorMsgs.method" required>
        <el-select @change="updateValue()" v-model="formModel.method">
          <el-option label="Credit" value="credit"></el-option>
          <el-option label="Debit" value="debit"></el-option>
          <el-option label="Cash" value="cash"></el-option>
          <el-option label="Cheque" value="cheque"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <el-form-item v-if="canSelectAction" :error="errorMsgs.status" label="Action" required>
        <el-radio-group v-model="action">
          <el-radio label="payNow">Pay Now</el-radio>
          <el-radio label="payLater">Pay through Paylink</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-col>
  </el-row>

  <el-row>
    <el-form-item v-if="canEnterCaptureAmount" :error="errorMsgs.amountCents" label="Capture Amount" class="capture-amount">
      <money-input v-model="formModel.amountCents" @input="updateValue()"></money-input>
    </el-form-item>
  </el-row>

  <template v-if="canEnterCreditCard">
    <hr/>
    <el-row>
      <el-col :span="24">
        <el-form-item class="card-from" required>
          <el-radio-group v-model="formModel.useCardFrom" @change="handleUseCardFromChange">
            <el-radio v-if="canSelectCards" label="savedCard">
              Select from saved cards
            </el-radio>
            <el-radio label="newCard">
              Enter a new card
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="formModel.useCardFrom === 'newCard'">
      <el-col :span="24">
        <el-form-item label="Card" class="card" required>
          <card class="stripe-card" :stripe="stripePk" :options="stripeOptions"></card>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="formModel.useCardFrom === 'newCard' && hasOwner">
      <el-col :span="24">
        <el-form-item class="card" required>
          <el-checkbox v-model="formModel.saveSource" @change="updateValue()">Save this card</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="formModel.useCardFrom === 'savedCard'">
      <el-col :span="24">
        <el-form-item class="card" required>
          <el-select v-model="formModel.source" @change="updateValue()" class="full">
            <el-option v-for="card in cards" :key="card.id" :label="`${card.brand} ****${card.lastFourDigit}`" :value="card.stripeCardId">
              <span>{{card.brand}} ****{{card.lastFourDigit}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <hr/>

    <el-row v-if="formModel.gateway === 'freshcom' && formModel.order && formModel.order.fulfillmentMethod === 'ship'">
      <el-form-item label="Billing Address" :error="errorMsgs.status">
        <el-radio-group v-model="isBillingAndShippingAddressSame" @change="updateValue()">
          <el-radio :label="false">Enter new address</el-radio>
          <el-radio :label="true">Same as shipping address</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>

    <template v-if="canEnterBillingAddress">
      <el-form-item label="Billing Address" :error="errorMsgs.billingAddressLineOne">
        <el-input v-model="formModel.billingAddressLineOne" @input="updateValue()" placeholder="Street address line 1"></el-input>
      </el-form-item>

      <el-form-item :error="errorMsgs.billingAddressLineTwo">
        <el-input v-model="formModel.billingAddressLineTwo" @input="updateValue()" placeholder="Street address line 2"></el-input>
      </el-form-item>

      <div class="form-item-wrapper multi-per-line small">
        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label-width="0px" :error="errorMsgs.billingAddressCity">
                <el-input v-model="formModel.billingAddressCity" @input="updateValue()" placeholder="City"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label-width="0px">
                <el-input v-model="formModel.billingAddressProvince" @input="updateValue()" placeholder="Province/State"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label-width="0px" :error="errorMsgs.billingAddressCountryCode">
                <el-input v-model="formModel.billingAddressCountryCode" @input="updateValue()" placeholder="Country"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label-width="0px">
                <el-input v-model="formModel.billingAddressPostalCode" @input="updateValue()" placeholder="Postal Code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
    </template>
  </template>
</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import MoneyInput from '@/components/money-input'
import { Card } from 'vue-stripe-elements-plus'
import { STRIPE_LIVE_PUBLISHABLE_KEY, STRIPE_TEST_PUBLISHABLE_KEY } from '@/env'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'payment' })

export default {
  name: 'PaymentFieldset',
  mixins: [FieldsetMixin],
  components: {
    Card,
    MoneyInput
  },
  data () {
    return {
      complete: false,
      action: 'payNow',
      cards: [],
      isLoadingCards: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      isBillingAndShippingAddressSame: false
    }
  },
  computed: {
    stripePk () {
      if (this.isTestMode) {
        return STRIPE_TEST_PUBLISHABLE_KEY
      } else {
        return STRIPE_LIVE_PUBLISHABLE_KEY
      }
    },

    isTestMode () {
      return this.$store.state.session.mode === 'test'
    },

    canSelectCards () {
      return this.cards.length > 0
    },

    hasOwner () {
      return this.formModel.owner
    },

    canSelectStatus () {
      return this.formModel.gateway === 'custom'
    },

    canEnterCaptureAmount () {
      return this.formModel.id && this.formModel.status === 'authorized'
    },

    canEnterCreditCard () {
      return !this.formModel.id && this.formModel.gateway === 'freshcom' && this.action === 'payNow'
    },

    canSelectProcessor () {
      return !this.formModel.id && this.formModel.gateway === 'freshcom'
    },

    canSelectAction () {
      return !this.formModel.id && this.formModel.gateway === 'freshcom'
    },

    canSelectGateway () {
      return !this.formModel.id
    },

    canEnterBillingAddress () {
      if (this.formModel.order && this.formModel.order.fulfillmentMethod === 'ship' && this.isBillingAndShippingAddressSame) {
        return false
      }

      return true
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)

      if (!this.formModel.owner || this.cards.length > 0) { return }

      this.loadCards(this.formModel.owner).then(cards => {
        if (cards.length === 0) { return cards }
        this.formModel.useCardFrom = 'savedCard'

        let primaryCard = _.find(cards, { primary: true })
        this.formModel.source = primaryCard.stripeCardId
        this.updateValue()
      })
    }
  },
  methods: {
    handleUseCardFromChange (useCardFrom) {
      if (useCardFrom === 'newCard') {
        this.formModel.source = undefined
      } else {
        let primaryCard = _.find(this.cards, { primary: true })
        this.formModel.source = primaryCard.stripeCardId
      }
      this.updateValue()
    },

    loadCards (owner) {
      this.isLoadingCards = true

      return freshcom.listCard({
        filter: { ownerId: owner.id, ownerType: owner.type }
      }).then(response => {
        this.cards = response.data
        this.isLoadingCards = false

        return response.data
      }).catch(response => {
        this.isLoadingCards = false
        throw response
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
