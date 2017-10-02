<template>
<el-form @input.native="updateValue" label-width="180px">

  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Email" :error="errorMessages.email" required>
    <el-input v-model="formModel.email"></el-input>
  </el-form-item>

  <el-form-item label="First Name" :error="errorMessages.firstName">
    <el-input v-model="formModel.firstName"></el-input>
  </el-form-item>

  <el-form-item label="Last Name" :error="errorMessages.lastName">
    <el-input v-model="formModel.lastName"></el-input>
  </el-form-item>

  <el-form-item label="Phone Number" :error="errorMessages.phoneNumber">
    <el-input v-model="formModel.phoneNumber"></el-input>
  </el-form-item>

  <hr>

  <el-form-item label="Street Address 1" :error="errorMessages.deliveryAddressLineOne">
    <el-input v-model="formModel.deliveryAddressLineOne"></el-input>
  </el-form-item>

  <el-form-item label="Street Address 2" :error="errorMessages.deliveryAddressLineTwo">
    <el-input v-model="formModel.deliveryAddressLineTwo"></el-input>
  </el-form-item>

  <el-form-item label="Province" :error="errorMessages.deliveryAddressProvince">
    <el-input v-model="formModel.deliveryAddressProvince"></el-input>
  </el-form-item>

  <el-form-item label="City" :error="errorMessages.deliveryAddressCity">
    <el-input v-model="formModel.deliveryAddressCity"></el-input>
  </el-form-item>

  <el-form-item label="Country" :error="errorMessages.deliveryAddressCountry">
    <el-input v-model="formModel.deliveryAddressCountry"></el-input>
  </el-form-item>

  <el-form-item label="Postal Code" :error="errorMessages.deliveryAddressPostalCode">
    <el-input v-model="formModel.deliveryAddressPostalCode"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'OrderForm',
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('ProductItem', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
    },
    skuErrorMessage () {
      if (this.errorMessages['relationships']) {
        return 'SKU is invalid'
      } else {
        return
      }
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

</style>
