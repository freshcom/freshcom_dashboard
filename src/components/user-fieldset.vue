<template>
<div class="component-wrapper user-fieldset">
  <el-form-item :error="errorMsgs.email" label="Email">
    <el-input v-model="formModel.email" @input="updateValue()" name="email" placeholder="Enter a email..."></el-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.username" label="Username" required>
    <el-input v-model="formModel.username" @input="updateValue()" name="username" placeholder="Enter a username..."></el-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.name" label="Name">
    <el-input v-model="formModel.name" @input="updateValue()" name="name" placeholder="Enter a name..."></el-input>
  </el-form-item>

  <el-form-item v-if="!formModel.id" :error="errorMsgs.password" label="Password" required>
    <el-input v-model="formModel.password" @input="updateValue()" name="password" type="password" placeholder="Enter your password..."></el-input>
  </el-form-item>

  <el-form-item :error="errorMsgs.role" label="Role" id="role" required>
    <el-select v-model="formModel.role" @change="updateValue()" placeholder="Select a role">
      <el-option label="Read Only" value="readOnly"></el-option>
      <el-option label="Support Specialist" value="supportSpecialist"></el-option>
      <el-option label="Goods Specialist" value="goodsSpecialist"></el-option>
      <el-option label="Marketing Specialist" value="marketingSpecialist"></el-option>
      <el-option label="Manager" value="manager"></el-option>
      <el-option label="Developer" value="developer"></el-option>
      <el-option label="Administrator" value="administrator"></el-option>
    </el-select>
  </el-form-item>
</div>
</template>

<script>
import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'user' })

export default {
  name: 'UserFieldset',
  mixins: [FieldsetMixin]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
