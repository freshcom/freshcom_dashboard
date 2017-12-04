<template>
<el-form @input.native="updateValue" label-width="180px" size="small">
  <el-form-item label="Data URL" :error="errorMsgs.dataUrl">
    <el-input v-model="formModel.dataUrl"></el-input>
  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'DataImportForm',
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'depositable')
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
