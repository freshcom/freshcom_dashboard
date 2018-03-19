<template>
<div class="component-wrapper card-fieldset">
  <el-form-item label="Cardholder Name" :error="errorMsgs.cardholderName">
    <el-input v-model="formModel.cardholderName" @input="updateValue"></el-input>
  </el-form-item>

  <el-form-item label="Expiry Date" :error="errorMsgs.expiry" required>
    <el-input v-model="formModel.expMonth" @input="updateValue" placeholder="MM" class="exp-month-input"></el-input>
    <span>/</span>
    <el-input v-model="formModel.expYear" @input="updateValue" placeholder="YYYY" class="exp-year-input"></el-input>
  </el-form-item>

  <el-form-item label="" :error="errorMsgs.primary">
    <el-checkbox v-model="formModel.primary" @change="updateValue">Primary</el-checkbox>
  </el-form-item>
</div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'fileCollectionMembership' })

export default {
  name: 'CardFieldset',
  mixins: [FieldsetMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.exp-month-input {
  width: 60px;
}
.exp-year-input {
  width: 80px;
}
</style>
