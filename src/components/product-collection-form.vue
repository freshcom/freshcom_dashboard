<template>
<el-form :model="formModel" @input.native="updateValue" label-width="150px" size="small" class="efc-form">

  <el-form-item label="Code" :error="errorMsgs.code">
    <el-input v-model="formModel.code"></el-input>
  </el-form-item>

  <el-form-item label="Status" :error="errorMsgs.status" required>
    <el-select @change="updateValue" v-model="formModel.status">
      <el-option label="Active" value="active"></el-option>
      <el-option label="Disabled" value="disabled"></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name" required>
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label">
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>

  <el-form-item label="Sort Index" :error="errorMsgs.sortIndex" required>
    <el-input-number @change="updateValue" v-model="formModel.sortIndex" :min="0" :step="100"></el-input-number>
  </el-form-item>

</el-form>
</template>

<script>
import _ from 'lodash'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'ProductCollelctionCollectionForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value)
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'productCollection')
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
<style>
</style>
