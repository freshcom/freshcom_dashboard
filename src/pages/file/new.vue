<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListFileCollection' }">File Collections</router-link>
    <router-link :to="{ name: 'ListFile' }">Files</router-link>
  </div>

  <div slot="card-header">
    <h1>Upload files</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Back
      </el-button>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-upload
            :http-request="uploadFile"
            :file-list="fileList"
            :on-remove="deleteFile"
            :before-remove="beforeDeleteFile"
            class="text-center uploader"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              Drop file here to upload or <em>click to upload</em>
            </div>
          </el-upload>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Back
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'

export default {
  name: 'NewFile',
  mixins: [PageMixin],
  props: {
    collectionId: {
      type: String
    }
  },
  data () {
    return {
      isCreating: false,
      fileList: [],
      errors: {}
    }
  },
  computed: {
    isAllUploaded () {
      let uploadedFiles = _.filter(this.fileList, (file) => { return file.status === 'uploaded' })
      return this.fileList.length > 0 && uploadedFiles.length === this.fileList.length
    }
  },
  watch: {
    isAllUploaded (v) {
      if (v) {
        let msg = `All of the files you selected have been uploaded successfully.`
        this.$confirm(msg, 'Upload completed', {
          confirmButtonText: 'I \'m done with uploading',
          cancelButtonText: 'Upload more files',
          cancelButtonClass: 'is-plain',
          showClose: false,
          customClass: 'top'
        }).then(() => {
          this.$message({
            showClose: true,
            message: `Files uploaded successfully.`,
            type: 'success'
          })
          this.back()
        }).catch(() => {
          // Do nothing
        })
      }
    }
  },
  methods: {
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
    },

    uploadFile (e) {
      let file = e.file
      let fileObject = { type: 'File', name: file.name, sizeBytes: file.size, contentType: file.type, file: file }

      freshcom.uploadFile(fileObject, {}, {
        created: (response) => {
          let fileObjectWithProgress = {
            id: response.data.id,
            name: response.data.name,
            status: 'uploading',
            percentage: 0
          }

          this.fileList.push(fileObjectWithProgress)
        },
        progress: _.throttle((percentage, fileObject) => {
          let targetFileObject = _.find(this.fileList, { id: fileObject.id })
          targetFileObject.percentage = percentage
          targetFileObject.status = 'uploading'
        }, 300)
      }).then(response => {
        let fileObject = _.find(this.fileList, { id: response.data.id })
        fileObject.status = 'uploaded'
      })
    },

    submit () {
      this.isCreating = true

      freshcom.createFileCollection(this.fileCollectionDraft).then(response => {
        this.$message({
          showClose: true,
          message: `File collection created successfully.`,
          type: 'success'
        })

        this.isCreating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListFile' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uploader {
  margin-top: 22px;
  margin-bottom: 22px;
}
</style>
