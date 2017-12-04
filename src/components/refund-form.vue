<template>
<el-form @input.native="updateValue" :model="formModel" label-width="120px" size="small" class="m-b-10">

  <el-form-item v-if="canSelectGateway" :error="errorMsgs.gateway" label="Gateway" required>
    <el-select @change="handleGatewayChange($event)" :value="formModel.gateway">
      <el-option label="Online" value="online"></el-option>
      <el-option label="Offline" value="offline"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'offline'" label="Method" :error="errorMsgs.method" required>
    <el-select @change="updateValue" v-model="formModel.method">
      <el-option label="Cash" value="cash"></el-option>
      <el-option label="Cheque" value="cheque"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item :error="errorMsgs.amountCents" required label="Refund Amount" size="small" class="refund-amount">
    <money-input v-model="formModel.amountCents" class="refund-amount-input"></money-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.notes" label="Notes" size="small" class="refund-amount">
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="Enter detail of this refund..."
      v-model="formModel.notes">
    </el-input>
  </el-form-item>

</el-form>
</template>

<script>
import _ from 'lodash'
import translateErrors from '@/helpers/translate-errors'
import MoneyInput from '@/components/money-input'

export default {
  name: 'RefundForm',
  props: ['value', 'errors'],
  components: {
    MoneyInput
  },
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    canSelectProcessor () {
      return !this.formModel.id && this.formModel.gateway === 'online'
    },

    canSelectGateway () {
      return !this.formModel.id && this.formModel.payment.gateway === 'online'
    },

    errorMsgs () {
      return translateErrors(this.errors, 'refund')
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
    }, 300),

    handleGatewayChange (value) {
      this.formModel.gateway = value
      if (value === 'offline') {
        this.formModel.method = 'cash'
      }
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.refund-amount-input {
  width: 120px;
}
</style>
