<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/files" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListExternalFile' }" index="/files">
        Files
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">
        Collections
      </el-menu-item>
    </el-menu>
    <locale-selector class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
        <div slot="header">
          <div v-if="isViewingTestData" class="test-data-banner">
            <div class="banner-content">TEST DATA</div>
          </div>

          <div class="brief">
            <div class="avatar">
              <img v-if="isImage(externalFile)" :src="externalFile.url">
              <icon v-else name="file" class="avatar-icon"></icon>
            </div>

            <div class="detail">
              <p>{{externalFile.code}}</p>
              <h2>{{externalFile.name}}</h2>
              <p class="id">{{externalFile.id}}</p>
            </div>
          </div>
        </div>


        <div class="data">
          <div class="block-title">
            <h3>Details</h3>
          </div>
          <div class="block">
            <div class="block-body">
              <dl>
                <dt>ID</dt>
                <dd>{{externalFile.id}}</dd>

                <dt>Status</dt>
                <dd>{{externalFile.status}}</dd>

                <dt>Name</dt>
                <dd>{{externalFile.name}}</dd>

                <dt>Content Type</dt>
                <dd>{{externalFile.contentType}}</dd>

                <dt>Size</dt>
                <dd>{{externalFile.sizeBytes}} bytes</dd>

                <dt>Public Readable</dt>
                <dd>{{externalFile.publicReadable}}</dd>

                <dt>Version Name</dt>
                <dd>{{externalFile.versionName}}</dd>

                <dt>Version Label</dt>
                <dd>{{externalFile.versionLabel}}</dd>

                <dt>URL</dt>
                <dd><a :href="externalFile.url" target="_blank">Click to open</a></dd>
              </dl>
            </div>
          </div>

          <h3>Custom Data</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>

          <h3>Related Resources</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>

          <h3>Logs</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>

          <h3>Events</h3>
          <div class="block">
            <div class="block-body">

            </div>
          </div>
        </div>

        <div class="footer text-right">
          <delete-button @confirmed="deleteExternalFile()" size="small">Delete</delete-button>
        </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/file'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import ExternalFile from '@/models/external-file'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowExternalFile',
  mixins: [PageMixin],
  components: {
    DeleteButton
  },
  props: ['id'],
  data () {
    return {
      externalFile: ExternalFile.objectWithDefaults(),
      isLoading: false,

      errors: {}
    }
  },
  created () {
    this.loadExternalFile()
  },
  methods: {
    loadExternalFile () {
      freshcom.retrieveExternalFile(this.id).then(response => {
        this.externalFile = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    isImage (externalFile) {
      return externalFile.contentType.startsWith('image/')
    },

    deleteExternalFile () {
      freshcom.deleteExternalFile(this.externalFile.id).then(() => {
        this.$message({
          showClose: true,
          message: `File deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListExternalFile' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
