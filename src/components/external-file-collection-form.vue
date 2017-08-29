<template>
<el-form @input.native="updateValue" label-width="150px">

  <el-form-item v-if="formModel.sku" label="SKU ID" :error="errorMessages.name">
    {{formModel.sku.id}}
  </el-form-item>

  <el-form-item label="Name" :error="errorMessages.name">
    <el-input v-model="formModel.name"></el-input>
  </el-form-item>

  <el-form-item label="Label" :error="errorMessages.label" required>
    <el-input v-model="formModel.label"></el-input>
  </el-form-item>

  <div class="block">
    <div class="block-body">
      <template v-for="ef in formModel.files">
        <div class="file-thumbnail">
          <div>
            <div class="wrapper">
              <img v-if="isImage(ef)" :src="ef.url">
              <icon v-else name="file" class="file-icon"></icon>

              <span class="file-actions">
                <a href="javascript:;" class="file-detail">
                  <i class="el-icon-view"></i>
                </a>
                <a @click="deleteExternalFile(ef)" href="javascript:;" class="file-delete">
                  <i class="el-icon-delete2"></i>
                </a>
              </span>
            </div>
          </div>
          <div class="caption">
            <span>{{ef.name}}</span>
          </div>
        </div>
      </template>

      <template v-for="pendingEf in pendingExternalFiles">
        <div class="file-thumbnail">
          <div>
            <div class="wrapper">
              <img v-if="isImage(pendingEf)" :src="previewUrl(pendingEf)">
              <icon v-else name="file" class="file-icon"></icon>
            </div>
          </div>
          <div class="caption">
            <el-progress :show-text="false" :percentage="pendingEf.percentage"></el-progress>
          </div>
        </div>
      </template>

      <div class="file-uploader file-thumbnail">
        <el-upload :http-request="uploadExternalFile" action="" :multiple="true " :show-file-list="false" :file-list="[]">
          <icon name="plus" class="file-uploader-icon"></icon>
        </el-upload>
      </div>
    </div>
  </div>
</el-form>
</template>

<script>
import _ from 'lodash'

import 'vue-awesome/icons/file'
import 'vue-awesome/icons/plus'

export default {
  name: 'ExternalFileCollectionForm',
  props: ['value', 'errors'],
  data () {
    return {
      formModel: _.cloneDeep(this.value),
      imageUrl: '',
      pendingAvatarId: '',
      fileTableData: [
        { name: 'x1.png', contentType: 'image/png' }
      ]
    }
  },
  computed: {
    errorMessages () {
      return _.reduce(this.errors, (result, v, k) => {
        result[k] = this.$t(`errors.${v[0]}`, { name: _.startCase(k) })
        return result
      }, {})
    },
    pendingExternalFiles () {
      return this.$store.state.externalFile.pendingRecords
    },
    uploadedExternalFiles () {
      return this.$store.state.externalFile.uploadedRecords
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
    },
    isImage (externalFile) {
      return externalFile.contentType.startsWith('image/')
    },
    previewUrl (externalFile) {
      return URL.createObjectURL(externalFile.file)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
