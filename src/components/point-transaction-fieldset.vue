<template>
  <div>
    <el-form-item label="Amount" :error="errorMsgs.amount" required>
      <div class="el-input el-input--small">
        <input v-model.lazy="amount" v-money="{ precision: 0, prefix: '' }" @input="amountInputHandler" autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner amount">
      </div>
    </el-form-item>

    <el-form-item label="Reason" :error="errorMsgs.reasonLabel">
      <el-select @change="updateValue" v-model="formModel.reasonLabel" placeholder="Please select a reason">
        <el-option label="Mannual Deposit" value="mannual_deposit"></el-option>
        <el-option label="Used" value="used"></el-option>
        <el-option label="Gift" value="gift"></el-option>
        <el-option label="Other" value="other"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Caption" :error="errorMsgs.caption">
      <el-input v-model="formModel.caption"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import _ from 'lodash'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'PointTransactionFieldset',
  props: ['value', 'errors'],
  data () {
    return {
      amount: this.value.amount,
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'pointTransaction')
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
      this.amount = this.formModel.amount
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),

    amountInputHandler () {
      let value = Number(this.amount.replace(/[^0-9.-]/g, ''))
      this.formModel.amount = value
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input.amount {
  text-align: right;
  width: 100px;
}
</style>
