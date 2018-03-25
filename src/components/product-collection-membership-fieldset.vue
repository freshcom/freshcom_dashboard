<template>
<div class="component-wrapper product-collection-membership-fieldset">
  <el-form-item label="Product" :error="errorMsgs.product" required>
    <product-select v-model="formModel.product" :disabled="!!formModel.id" @input="updateValue()"></product-select>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number v-model="formModel.sortIndex" :min="0" :step="1000" @change="updateValue()"></el-input-number>
  </el-form-item>
</div>
</template>

<script>
import ProductSelect from '@/components/product-select'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'productCollectionMembership' })

export default {
  name: 'ProductCollelctionCollectionFieldset',
  mixins: [FieldsetMixin],
  components: {
    ProductSelect
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
