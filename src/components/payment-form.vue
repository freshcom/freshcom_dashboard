<template>
<el-form @input.native="updateValue" label-width="180px">

  <el-form-item label="Gateway" :error="errorMessages.gateway" required>
    <el-select @change="updateValue" v-model="formModel.gateway">
      <el-option label="Online" value="online"></el-option>
      <el-option label="In Person" value="in_person"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'online'" label="Processor" :error="errorMessages.processor" required>
    <el-select @change="updateValue" v-model="formModel.processor">
      <el-option label="Stripe" value="stripe"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'online'" label="Action" :error="errorMessages.status" required>
    <el-radio-group @change="updateValue" v-model="formModel.status">
      <el-radio label="paid">Pay Now</el-radio>
      <el-radio label="pending">Pay through Paylink</el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'online' && formModel.status === 'paid'" label="Card" required>
    <card class="stripe-card" :class="{ complete }" :stripe="stripePk" :options="stripeOptions" @change="complete = $event.complete"></card>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'in_person'" label="Status" :error="errorMessages.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Pending" value="pending"></el-option>
      <el-option label="Paid" value="paid"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'in_person'" label="Method" :error="errorMessages.method" required>
    <el-select @change="updateValue" v-model="formModel.method">
      <el-option label="Credit" value="credit"></el-option>
      <el-option label="Debit" value="debit"></el-option>
      <el-option label="Cash" value="cash"></el-option>
      <el-option label="Cheque" value="cheque"></el-option>
    </el-select>
  </el-form-item>

  <hr>

  <template v-if="formModel.gateway === 'online'">
    <el-form-item label="Street Address 1" :error="errorMessages.billingAddressLineOne" required>
      <el-input v-model="formModel.billingAddressLineOne"></el-input>
    </el-form-item>

    <el-form-item label="Street Address 2" :error="errorMessages.billingAddressLineTwo">
      <el-input v-model="formModel.billingAddressLineTwo"></el-input>
    </el-form-item>

    <el-form-item label="Province" :error="errorMessages.billingAddressProvince" required>
      <el-input v-model="formModel.billingAddressProvince"></el-input>
    </el-form-item>

    <el-form-item label="City" :error="errorMessages.billingAddressCity" required>
      <el-input v-model="formModel.billingAddressCity"></el-input>
    </el-form-item>

    <el-form-item label="Country" :error="errorMessages.billingAddressCountry" required>
      <el-input v-model="formModel.billingAddressCountry"></el-input>
    </el-form-item>

    <el-form-item label="Postal Code" :error="errorMessages.billingAddressPostalCode" required>
      <el-input v-model="formModel.billingAddressPostalCode"></el-input>
    </el-form-item>
  </template>

</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'
import { Card } from 'vue-stripe-elements'
import { STRIPE_PUBLISHABLE_KEY } from '@/env'

export default {
  name: 'PaymentForm',
  props: ['value', 'errors', 'record'],
  components: {
    Card
  },
  data () {
    return {
      complete: false,
      formModel: _.cloneDeep(this.value),
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      stripePk: STRIPE_PUBLISHABLE_KEY
    }
  },
  computed: {
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
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 6px 10px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
</style>
