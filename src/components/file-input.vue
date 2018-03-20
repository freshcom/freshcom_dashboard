<template>
<div class="component-wrapper file-input">
  <el-upload
    :http-request="uploadFile"
    :file-list="fileList"
    :before-remove="beforeDeleteFile"
    :on-remove="deleteFile"
    action=""
  >
    <el-button size="small" plain>{{text}}</el-button>
  </el-upload>
</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

export default {
  name: 'FileInput',
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    text: {
      type: String,
      default: 'Click to upload'
    }
  },
  data () {
    return {
      file: _.cloneDeep(this.value),
      fileList: this.initialFileList(this.value)
    }
  },
  watch: {
    value (v) {
      this.file = _.cloneDeep(v)
    }
  },
  methods: {
    initialFileList (value) {
      if (_.isEmpty(value)) {
        return []
      }

      return [this.toFilePreviewObject(value)]
    },

    toFilePreviewObject (fileObject) {
      let filePreviewObject = { id: fileObject.id, name: fileObject.name }

      if (!filePreviewObject.name) {
        filePreviewObject.name = fileObject.id
      }

      if (fileObject.status === 'pending') {
        filePreviewObject.status = 'uploading'
        filePreviewObject.percentage = 0
      } else {
        filePreviewObject.status = 'uploaded'
        filePreviewObject.percentage = 100
      }

      return filePreviewObject
    },

    beforeDeleteFile (fileObject) {
      if (fileObject.status === 'uploaded') {
        return this.$confirm('Are you sure you want to delete this file?', 'Delete file', {
          confirmButtonText: 'Delete',
          confirmButtonClass: 'el-button--danger',
          cancelButtonClass: 'is-plain',
          showClose: false,
          customClass: 'top'
        }).then(() => {
          return true
        })
      }

      let msg = `File cannot be deleted while its still uploading.
                 If you want to cancel the upload please manually refresh the page.
                 Aborted file will be deleted automatically.`
      this.$alert(msg, 'Cannot delete file', {
        confirmButtonText: 'Ok',
        showClose: false,
        customClass: 'top'
      })

      return false
    },

    deleteFile (fileObject) {
      freshcom.deleteFile(fileObject.id)
      this.$emit('input', {})
    },

    uploadFile (e) {
      if (this.fileList.length > 0) {
        this.deleteFile(this.fileList[0])
        this.fileList = []
      }

      let file = e.file
      let fileObject = { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }

      freshcom.uploadFile(fileObject, {}, {
        created: (response) => {
          let filePreviewObject = this.toFilePreviewObject(response.data)
          this.fileList = [filePreviewObject]
        },
        progress: _.throttle((percentage, fileObject) => {
          let targetFileObject = this.fileList[0]
          targetFileObject.percentage = percentage
          targetFileObject.status = 'uploading'
        }, 300)
      }).then(response => {
        let fileObject = _.find(this.fileList, { id: response.data.id })
        fileObject.status = 'uploaded'
        this.$emit('input', response.data)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
