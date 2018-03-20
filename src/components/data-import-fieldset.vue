<template>
<div class="component-wrapper data-import-fieldset">
  <el-form-item label="Source" :error="errorMsgs.dataUrl">
    <el-input v-model="formModel.dataUrl" :disabled="!canEnterUrl" @input="updateValue()" placeholder="Enter url to csv file"></el-input>

    <div class="divider">Or</div>

    <file-input v-model="formModel.file" text="Upload file" @input="fileInputHandler"></file-input>
  </el-form-item>

  <el-form-item label="Type">
    <el-radio v-for="type in dataTypes" v-model="formModel.dataType" :key="type" :label="type" @input="updateValue()" border>{{type}}</el-radio>
  </el-form-item>
</div>
</template>

<script>
import _ from 'lodash'
import FileInput from '@/components/file-input'

import fieldsetMixinFactory from '@/mixins/fieldset'
let FieldsetMixin = fieldsetMixinFactory({ errorI18nKey: 'dataImport' })

export default {
  name: 'DataImportFieldset',
  mixins: [FieldsetMixin],
  components: {
    FileInput
  },
  props: {
    dataTypes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    canEnterUrl () {
      return _.isEmpty(this.formModel.file)
    }
  },
  methods: {
    fileInputHandler (file) {
      this.formModel.dataUrl = file.url
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divider {
  padding-left: 35px;
}
</style>
