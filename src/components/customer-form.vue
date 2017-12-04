<template>
<el-form @input.native="updateValue" label-width="180px" size="small">
  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Guest" value="guest"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Registered" value="registered"></el-option>
      <el-option label="Suspended" value="suspended"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.firstName" :required="formModel.status === 'registered'">
    <el-input v-model="formModel.firstName" placeholder="First Name" class="name-input"></el-input>
    <el-input v-model="formModel.lastName" placeholder="Last Name" class="name-input"></el-input>
  </el-form-item>

  <el-form-item label="Email" :error="errorMsgs.email" :required="formModel.status === 'registered'">
    <el-input v-model="formModel.email"></el-input>
  </el-form-item>

  <el-form-item v-show="canInputPassword" :error="errorMsgs.password" label="Password" required>
    <el-input v-model="formModel.password" type="password"></el-input>
  </el-form-item>

  <el-form-item label="Phone" :error="errorMsgs.phoneNumber">
    <el-input v-model="formModel.phoneNumber"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label">
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'CustomerForm',
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'customer')
    },

    canInputPassword () {
      return this.formModel.status === 'registered' && !this.formModel.id
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.name-input {
  width: 49.6%;
}
</style>
