<template>
<div class="component-wrapper account-fieldset">
  <el-form-item :error="errorMsgs.name" label="Name">
    <el-input v-model="formModel.name" @input="updateValue()" name="name" placeholder="Enter a name..."></el-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.alias" label="Alias">
    <el-input v-model="formModel.alias" @input="updateValue()" name="alias" placeholder="Enter a alias..."></el-input>
  </el-form-item>

  <el-form-item label="Default Locale">
    <el-select v-model="formModel.defaultLocale" disabled>
      <el-option value="en" label="English (en)"></el-option>
      <el-option value="zh-CN" label="简体中文 (zh-CN)"></el-option>
    </el-select>
  </el-form-item>
</div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'user' })

export default {
  name: 'AccountFieldset',
  mixins: [FieldsetMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
