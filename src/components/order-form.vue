<template>
<el-form @input.native="updateValue" label-width="180px">

  <el-form-item label="Code" :error="errorMessages.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Email" :error="errorMessages.email" required>
    <el-input v-model="formModel.email"></el-input>
  </el-form-item>

  <el-form-item label="Name" :error="errorMessages.firstName" required>
    <el-input v-model="formModel.firstName" placeholder="First Name" class="name-input"></el-input>
    <el-input v-model="formModel.lastName" placeholder="Last Name" class="name-input"></el-input>
  </el-form-item>

  <el-form-item label="Phone Number" :error="errorMessages.phoneNumber">
    <el-input v-model="formModel.phoneNumber"></el-input>
  </el-form-item>

  <hr>

  <el-form-item label="Fulfillment Method" :error="errorMessages.fulfillmentMethod" required>
    <el-select @change="updateValue" v-model="formModel.fulfillmentMethod">
      <el-option label="Ship" value="ship"></el-option>
      <el-option label="Pick Up" value="pickup"></el-option>
      <el-option label="Digital" value="digital"></el-option>
    </el-select>
  </el-form-item>

  <template v-if="formModel.fulfillmentMethod === 'ship'">
    <el-form-item label="Street Address 1" :error="errorMessages.deliveryAddressLineOne" required>
      <el-input v-model="formModel.deliveryAddressLineOne"></el-input>
    </el-form-item>

    <el-form-item label="Street Address 2" :error="errorMessages.deliveryAddressLineTwo">
      <el-input v-model="formModel.deliveryAddressLineTwo"></el-input>
    </el-form-item>

    <el-form-item label="Province" :error="errorMessages.deliveryAddressProvince" required>
      <el-input v-model="formModel.deliveryAddressProvince"></el-input>
    </el-form-item>

    <el-form-item label="City" :error="errorMessages.deliveryAddressCity" required>
      <el-input v-model="formModel.deliveryAddressCity"></el-input>
    </el-form-item>

    <el-form-item label="Country" :error="errorMessages.deliveryAddressCountryCode" required>
      <el-input v-model="formModel.deliveryAddressCountryCode"></el-input>
    </el-form-item>

    <el-form-item label="Postal Code" :error="errorMessages.deliveryAddressPostalCode" required>
      <el-input v-model="formModel.deliveryAddressPostalCode"></el-input>
    </el-form-item>
  </template>
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
.name-input {
  width: 49.6%;
}
</style>
