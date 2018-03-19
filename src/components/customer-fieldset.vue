<template>
<div class="component-wrapper unlockable-fieldset">
  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code" @input="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select v-model="formModel.status" @change="updateValue()">
      <el-option label="Guest" value="guest"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Registered" value="registered"></el-option>
      <el-option label="Suspended" value="suspended"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name">
    <el-input v-model="formModel.name" @change="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Email" :error="errorMsgs.email" :required="formModel.status === 'registered'">
    <el-input v-model="formModel.email" @change="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Username" :error="errorMsgs.username" :required="formModel.status === 'registered'">
    <el-input v-model="formModel.username" @change="updateValue()"></el-input>
  </el-form-item>

  <el-form-item v-show="canInputPassword" :error="errorMsgs.password" label="Password" required>
    <el-input v-model="formModel.password" @change="updateValue()" type="password"></el-input>
  </el-form-item>

  <el-form-item label="Phone" :error="errorMsgs.phoneNumber">
    <el-input v-model="formModel.phoneNumber" @change="updateValue()"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label">
    <el-input v-model="formModel.label" @change="updateValue()"></el-input>
  </el-form-item>
</div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'unlockable' })

export default {
  name: 'CustomerFieldset',
  mixins: [FieldsetMixin],
  computed: {
    canInputPassword () {
      return this.formModel.status === 'registered' && !this.formModel.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name-input {
  width: 49.4%;
}
</style>
