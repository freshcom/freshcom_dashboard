<template>
<div class="component-wrapper refund-fieldset">
  <el-form-item v-if="canSelectGateway" :error="errorMsgs.gateway" label="Gateway" required>
    <el-select @change="catewayChangeHandler($event)" :value="formModel.gateway">
      <el-option label="Freshcom" value="freshcom"></el-option>
      <el-option label="Custom" value="custom"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item v-if="formModel.gateway === 'custom'" :error="errorMsgs.method" label="Method" required>
    <el-select v-model="formModel.method" @change="updateValue()">
      <el-option label="Cash" value="cash"></el-option>
      <el-option label="Cheque" value="cheque"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item :error="errorMsgs.amountCents" required label="Refund Amount" size="small" class="refund-amount">
    <money-input v-model="formModel.amountCents" @input="updateValue()" class="refund-amount-input"></money-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.notes" label="Notes" size="small" class="refund-amount">
    <el-input
      v-model="formModel.notes"
      :autosize="{ minRows: 2, maxRows: 4 }"
      @input="updateValue()"
      type="textarea"
      placeholder="Enter detail of this refund..."
      >
    </el-input>
  </el-form-item>
</div>
</template>

<script>
import MoneyInput from '@/components/money-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'refund' })

export default {
  name: 'RefundFieldset',
  mixins: [FieldsetMixin],
  components: {
    MoneyInput
  },
  computed: {
    canSelectProcessor () {
      return !this.formModel.id && this.formModel.gateway === 'freshcom'
    },

    canSelectGateway () {
      return !this.formModel.id && this.formModel.payment.gateway === 'freshcom'
    }
  },
  methods: {
    catewayChangeHandler (value) {
      this.formModel.gateway = value
      if (value === 'custom') {
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
