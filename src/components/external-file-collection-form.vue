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
          :http-request="uploadExternalFile"
          :file-list="fileList"
          :on-remove="deleteExternalFile"
          action=""
          multiple
          >
          <el-button size="small">Choose File</el-button>
        </el-upload>
      </div>
    </div>

  </el-form-item>
</el-form>
</template>

<script>
import _ from 'lodash'

import 'vue-awesome/icons/file'
import 'vue-awesome/icons/plus'

import translateErrors from '@/helpers/translate-errors'

export default {
  name: 'ExternalFileCollectionForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      pendingAvatarId: ''
    }
  },
  computed: {
    errorMsgs () {
      return translateErrors(this.errors, 'externalFileCollection')
    },
    fileList () {
      return _.reduce(this.formModel.files, (result, item) => {
        return result.concat({ id: item.id, name: item.name, url: item.url, percentage: 20, status: 'uploading' })
      }, [])
    },
    pendingExternalFiles () {
      return this.$store.state.externalFile.pendingRecords
    },
    uploadedExternalFiles () {
      return this.$store.state.externalFile.uploadedRecords
    },
    isUploading () {
      return this.pendingExternalFiles.length > 0
    }
  },
  watch: {
    value (v) {
      this.formModel = _.cloneDeep(v)
    },
    uploadedExternalFiles (uploadedEfs) {
      if (uploadedEfs.length === 0) {
        return
      }

      this.$store.dispatch('externalFile/popUploadedRecords', uploadedEfs)

      let files = _.concat(this.formModel.files, uploadedEfs)
      this.formModel.files = _.uniqBy(files, (ef) => { return ef.id })
      this.updateValue()
    }
  },
  methods: {
    updateValue: _.debounce(function () {
      this.$emit('input', this.formModel)
    }, 300),
    uploadExternalFile (e) {
      let file = e.file
      let externalFile = { type: 'ExternalFile', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }
      this.$store.dispatch('externalFile/pushPendingRecords', [externalFile]).then(files => {
        this.pendingAvatarId = files[0].id
      })
    },
    deleteExternalFile (targetEf) {
      this.formModel.files = _.reject(this.formModel.files, (ef) => { return ef.id === targetEf.id })
      this.updateValue()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
