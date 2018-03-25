<template>
<div class="component-wrapper product-collection-fieldset">
  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select v-model="formModel.status" @change="updateValue()" >
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label">
    <el-input v-model="formModel.label" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number v-model="formModel.sortIndex" :min="0" :step="1000" @change="updateValue()"></el-input-number>
  </el-form-item>
</div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'productCollection' })

export default {
  name: 'ProductCollelctionFieldset',
  mixins: [FieldsetMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
