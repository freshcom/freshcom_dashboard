<template>
<el-form @input.native="updateValue" label-width="180px" size="small">
  <el-form-item label="Data URL" :error="errorMsgs.dataUrl">
    <el-input v-model="formModel.dataUrl"></el-input>
  </el-form-item>

  <el-upload
    class="text-center"
    :http-request="uploadFile"
    drag
    action="https://jsonplaceholder.typicode.com/posts/"
    multiple>
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">
      Drop file here to upload or <em>click to upload</em>
    </div>
  </el-upload>
</el-form>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'
import translateErrors from '@/helpers/translate-errors'

import FFile from '@/models/file'

export default {
  name: 'DataImportForm',
  props: ['value', 'errors', 'record'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      targetFile: FFile.objectWithDefaults()
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
    }, 300),

    uploadFile (e) {
      this.targetFile = FFile.objectWithDefaults()

      let file = e.file
      let fFile = { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }
      freshcom.uploadFile(fFile, {}, {
        created: (response) => {
          this.targetFile = _.merge({}, response.data, {
            status: 'uploading',
            percentage: 0
          })
        },
        progress: _.throttle((percentage, ef) => {
          this.targetFile.percentage = percentage
          this.targetFile.status = 'uploading'
        }, 300)
      }).then(response => {
        this.targetFile = response.data
        this.formModel.dataUrl = response.data.url
        this.updateValue()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
