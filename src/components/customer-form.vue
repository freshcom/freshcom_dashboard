<template>
<el-form @input.native="updateValue" label-width="180px" size="small">
  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMessages.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Guest" value="guest"></el-option>
      <el-option label="Internal" value="internal"></el-option>
      <el-option label="Registered" value="registered"></el-option>
      <el-option label="Suspended" value="suspended"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMessages.firstName" :required="formModel.status === 'registered'">
    <el-input v-model="formModel.firstName" placeholder="First Name" class="name-input"></el-input>
    <el-input v-model="formModel.lastName" placeholder="Last Name" class="name-input"></el-input>
  </el-form-item>

  <el-form-item label="Email" :error="errorMessages.email" :required="formModel.status === 'registered'">
    <el-input v-model="formModel.email"></el-input>
  </el-form-item>

  <el-form-item v-show="canInputPassword" :error="errorMessages.password" label="Password" required>
    <el-input v-model="formModel.password" type="password"></el-input>
  </el-form-item>

  <el-form-item label="Phone" :error="errorMessages.phoneNumber">
    <el-input v-model="formModel.phoneNumber"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMessages.label">
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'CustomerForm',
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('Customer', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
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
