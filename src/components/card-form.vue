<template>
<el-form @input.native="updateValue" :model="formModel" label-width="180px" size="small" class="m-b-10">

  <el-form-item label="Cardholder Name" :error="errorMessages.cardholderName">
    <el-input v-model="formModel.cardholderName"></el-input>
  </el-form-item>

  <el-form-item label="Expiry Date" :error="errorMessages.expiry" required>
    <el-input v-model="formModel.expMonth" placeholder="MM" class="exp-month-input"></el-input>
    <span>/</span>
    <el-input v-model="formModel.expYear" placeholder="YYYY" class="exp-year-input"></el-input>
  </el-form-item>

  <el-form-item label="Primary" :error="errorMessages.primary">
    <el-checkbox v-model="formModel.primary" @change="updateValue">Primary</el-checkbox>
  </el-form-item>

</el-form>
</template>

<script>
import _ from 'lodash'
import errorI18nKey from '@/utils/error-i18n-key'

export default {
  name: 'CardForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(errorI18nKey('Payment', k, v[0]), { name: _.startCase(k) })
        return result
      }, {})
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
    }, 300),

    handleExpiryChange (e) {
      console.log(e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.exp-month-input {
  width: 60px;
}
.exp-year-input {
  width: 80px;
}
</style>
