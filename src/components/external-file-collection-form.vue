<template>
<el-form :model="formModel" @input.native="updateValue" label-width="150px" size="small" class="efc-form">

  <el-form-item v-if="formModel.owner" label="Owner ID" :error="errorMsgs.owner">
    {{formModel.owner.id}}
  </el-form-item>

  <el-form-item v-if="formModel.owner" label="Owner type" :error="errorMsgs.owner">
    {{formModel.owner.type}}
  </el-form-item>

  <el-form-item label="Name" :error="errorMsgs.name">
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMsgs.label" required>
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>

  <el-form-item>
    <div class="block-title">
      <h3>Files</h3>
    </div>
    <div class="block">
      <div class="block-body">
        <el-upload
          :http-request="uploadFile"
          :file-list="fileList"
          :on-remove="deleteFile"
          action=""
          multiple
          >
          <el-button plain size="small">Choose File</el-button>
        </el-upload>
      </div>
    </div>

  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/plus'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'FileCollectionForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      pendingAvatarId: '',
      data: null,
      uploadingFiles: []
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'fileCollection')
    },
    fileList () {
      return _.concat(this.uploadingFiles, this.toFileList(this.formModel.files))
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

    toFileList (efList) {
      return _.reduce(efList, (result, ef) => {
        return result.concat({ id: ef.id, name: ef.name, url: ef.url, status: 'success' })
      }, [])
    },

    uploadFile (e) {
      let file = e.file
      let fFile = { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }

      freshcom.uploadFile(fFile, {}, {
        created: (response) => {
          let fFile = response.data
          let f = {
            id: fFile.id,
            name: fFile.name,
            status: 'uploading',
            percentage: 0
          }

          this.uploadingFiles.push(f)
        },
        progress: _.throttle((percentage, ef) => {
          let targetEf = _.find(this.uploadingFiles, { id: ef.id })
          targetEf.percentage = percentage
          targetEf.status = 'uploading'
        }, 300)
      }).then(response => {
        _.remove(this.uploadingFiles, (f) => { return f.id === response.data.id })

        this.formModel.files.push(response.data)
        this.updateValue()
      })
    },

    deleteFile (targetEf) {
      this.formModel.files = _.reject(this.formModel.files, (ef) => { return ef.id === targetEf.id })
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
