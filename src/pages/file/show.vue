<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListFileCollection' }">File Collections</router-link>
    <router-link :to="{ name: 'ListFile' }">Files</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <img v-if="isImage(file)" :src="file.url">
        <icon v-else name="file" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>File</span>
          <span>{{file.code}}</span>
        </p>
        <h1>{{file.name}}</h1>
        <p class="id">{{file.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditFile', params: { id: this.file.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="card-content">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{file.id}}</dd>

            <dt>Status</dt>
            <dd>{{file.status}}</dd>

            <dt>Name</dt>
            <dd>{{file.name}}</dd>

            <dt>Content Type</dt>
            <dd>{{file.contentType}}</dd>

            <dt>Size</dt>
            <dd>{{file.sizeBytes}} bytes</dd>

            <dt>Public Readable</dt>
            <dd>{{file.publicReadable}}</dd>

            <dt>Version Name</dt>
            <dd>{{file.versionName}}</dd>

            <dt>Version Label</dt>
            <dd>{{file.versionLabel}}</dd>

            <dt>URL</dt>
            <dd><a :href="file.url" target="_blank">Click to open</a></dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{file.customData}}
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click.native="attemptDeleteFile()" plain size="small">Delete</el-button>
    </div>

    <div class="launchable">
      <el-dialog :show-close="false" :visible="isConfirmingDeleteFile" title="Delete file" width="500px">
        <p>
          Are you sure you want to delete this file?

          <br/><br/>
          <b>This action cannot be undone.</b>
        </p>

        <div slot="footer">
          <el-button :disabled="isDeletingFile" @click="cancelDeleteFile()" plain size="small">Cancel</el-button>
          <el-button :loading="isDeletingFile" @click="deleteFile()" type="danger" size="small">Delete</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>
</template>

<script>
import 'vue-awesome/icons/file'
import freshcom from '@/freshcom-sdk'

import FFile from '@/models/file'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadFile' })

export default {
  name: 'ShowFile',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      file: FFile.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteFile: false,
      isDeletingFile: false,

      errors: {}
    }
  },
  methods: {
    loadFile () {
      this.isLoading = true

      return freshcom.retrieveFile(this.id).then(response => {
        this.file = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    isImage (file) {
      return file.contentType.startsWith('image/')
    },

    attemptDeleteFile () {
      this.isConfirmingDeleteFile = true
    },

    cancelDeleteFile () {
      this.isConfirmingDeleteFile = false
    },

    deleteFile () {
      this.isDeletingFile = true

      freshcom.deleteFile(this.file.id).then(() => {
        this.isDeletingFile = false
        this.$message({
          showClose: true,
          message: `File deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingFile = false
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
</style>
