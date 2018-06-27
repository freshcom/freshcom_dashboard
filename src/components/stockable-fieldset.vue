<template>
<div class="component-wrapper stockable-fieldset">
  <el-form-item>
    <avatar-input v-model="formModel.avatar" @input="updateValue()"></avatar-input>
  </el-form-item>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select v-model="formModel.status" @change="updateValue()">
      <el-option label="Active" value="active"></el-option>
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name" @input="updateValue()" name="name"></el-input>
  </el-form-item>

  <el-form-item label="Print Name" :error="errorMsgs.printName">
    <el-input v-model="formModel.printName" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Unit Of Measure" :error="errorMsgs.unitOfMeasure" required>
    <el-input v-model="formModel.unitOfMeasure" @input="updateValue()" name="unit-of-measure" width="200px"></el-input>
  </el-form-item>

  <el-form-item label="Variable Weight" :error="errorMsgs.variableWeight" required>
    <el-switch
      v-model="formModel.variableWeight"
      @change="updateValue()"
      active-text="Yes"
      inactive-text="No">
    </el-switch>
  </el-form-item>

  <hr>

  <el-form-item label="Storage Type" :error="errorMsgs.storageType">
    <el-select v-model="formModel.storageType" @change="updateValue()" placeholder="Select Storage Type">
      <el-option label="Room" value="room"></el-option>
      <el-option label="Frozen" value="frozen"></el-option>
      <el-option label="Refrigerated" value="refrigerated"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Stackable" :error="errorMsgs.stackable" required>
    <el-switch
      v-model="formModel.stackable"
      @change="updateValue()"
      active-text="Yes"
      inactive-text="No">
    </el-switch>
  </el-form-item>

  <el-form-item label="Storage Size" :error="errorMsgs.storageSize" required>
    <el-input-number v-model="formModel.storageSize" :min="0" :step="100" @input="updateValue()"></el-input-number>
  </el-form-item>

  <el-form-item label="Storage Description">
    <el-input v-model="formModel.storageDescription" @input="updateValue()" type="textarea"></el-input>
  </el-form-item>

  <hr>

  <el-form-item label="Specification">
    <el-input v-model="formModel.specification" @input="updateValue()" type="textarea"></el-input>
  </el-form-item>

  <el-form-item label="Caption">
    <el-input v-model="formModel.caption" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Description">
    <el-input v-model="formModel.description" @input="updateValue()" type="textarea"></el-input>
  </el-form-item>
</div>
</template>

<script>
import AvatarInput from '@/components/avatar-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'stockable' })

export default {
  name: 'StockableFieldset',
  mixins: [FieldsetMixin],
  components: {
    AvatarInput
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
