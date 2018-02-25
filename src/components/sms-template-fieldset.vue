<template>
  <div class="component-wrapper sms-template-fieldset">
    <el-form-item label="Name" :error="errorMsgs.name" required>
      <el-input v-model="formModel.name" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="Description">
      <el-input type="textarea" v-model="formModel.description" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="To" :error="errorMsgs.to" required>
      <el-input v-model="formModel.to" @input="updateValue"></el-input>
    </el-form-item>

    <el-form-item label="Body" :error="errorMsgs.body" required>
      <el-input v-model="formModel.body" @input="updateValue"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import _ from 'lodash'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'SmsTemplateFieldset',
  props: ['value', 'errors'],
  data () {
    return {
      amount: this.value.amount,
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'smsTemplate')
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
<style lang="scss" scoped>
</style>
