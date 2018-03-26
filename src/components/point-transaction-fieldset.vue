<template>
  <div>
    <el-form-item label="Amount" :error="errorMsgs.amount" required>
      <div class="el-input el-input--small">
        <input :value="formModel.amount" v-money="{ precision: 0, prefix: '' }" @change="handleChange" autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner amount">
      </div>
    </el-form-item>

    <el-form-item label="Reason" :error="errorMsgs.reasonLabel">
      <el-select @change="updateValue()" v-model="formModel.reasonLabel" placeholder="Please select a reason">
        <el-option label="Mannual Deposit" value="mannual_deposit"></el-option>
        <el-option label="Used" value="used"></el-option>
        <el-option label="Gift" value="gift"></el-option>
        <el-option label="Other" value="other"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Caption" :error="errorMsgs.caption">
      <el-input v-model="formModel.caption" @input="updateValue()"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'fileCollectionMembership' })

export default {
  name: 'PointTransactionFieldset',
  mixins: [FieldsetMixin],
  methods: {
    handleChange (e) {
      let amountValue = Number(e.target.value.replace(/[^0-9.-]/g, ''))

      if (amountValue !== this.formModel.amount) {
        this.formModel.amount = amountValue
        this.updateValue()
      }
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
