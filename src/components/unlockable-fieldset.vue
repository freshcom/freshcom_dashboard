<template>
<div class="component-wrapper unlockable-fieldset">
  <avatar-input v-model="formModel.avatar" @input="updateValue()"></avatar-input>

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select v-model="formModel.status" @change="updateValue()">
      <el-option label="Draft" value="draft"></el-option>
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Print Name" :error="errorMsgs.printName">
    <el-input v-model="formModel.printName" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Caption">
    <el-input v-model="formModel.caption" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Description">
    <el-input v-model="formModel.description" @input="updateValue()" type="textarea"></el-input>
  </el-form-item>

  <el-form-item label="File">
    <file-input v-model="formModel.file" @input="updateValue()"></file-input>
  </el-form-item>
</div>
</template>

<script>
import AvatarInput from '@/components/avatar-input'
import FileInput from '@/components/file-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'unlockable' })

export default {
  name: 'UnlockableFieldset',
  mixins: [FieldsetMixin],
  components: {
    AvatarInput,
    FileInput
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar-input {
  margin-top: 22px;
}
</style>
