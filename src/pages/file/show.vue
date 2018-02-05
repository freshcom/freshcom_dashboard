<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/files" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListFile' }" index="/files">
        Files
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListFileCollection' }" index="/file_collections">
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
              <img v-if="isImage(fFile)" :src="fFile.url">
              <icon v-else name="file" class="avatar-icon"></icon>
            </div>

            <div class="detail">
              <p>{{fFile.code}}</p>
              <h2>{{fFile.name}}</h2>
              <p class="id">{{fFile.id}}</p>
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
                <dd>{{fFile.id}}</dd>

                <dt>Status</dt>
                <dd>{{fFile.status}}</dd>

                <dt>Name</dt>
                <dd>{{fFile.name}}</dd>

                <dt>Content Type</dt>
                <dd>{{fFile.contentType}}</dd>

                <dt>Size</dt>
                <dd>{{fFile.sizeBytes}} bytes</dd>

                <dt>Public Readable</dt>
                <dd>{{fFile.publicReadable}}</dd>

                <dt>Version Name</dt>
                <dd>{{fFile.versionName}}</dd>

                <dt>Version Label</dt>
                <dd>{{fFile.versionLabel}}</dd>

                <dt>URL</dt>
                <dd><a :href="fFile.url" target="_blank">Click to open</a></dd>
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
          <confirm-button @confirmed="deleteFile()" size="small">Delete</confirm-button>
        </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/file'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import FFile from '@/models/file'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'ShowFile',
  mixins: [PageMixin],
  components: {
    ConfirmButton
  },
  props: ['id'],
  data () {
    return {
      fFile: FFile.objectWithDefaults(),
      isLoading: false,

      errors: {}
    }
  },
  created () {
    this.loadFile()
  },
  methods: {
    loadFile () {
      freshcom.retrieveFile(this.id).then(response => {
        this.fFile = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    isImage (fFile) {
      return fFile.contentType.startsWith('image/')
    },

    deleteFile () {
      freshcom.deleteFile(this.fFile.id).then(() => {
        this.$message({
          showClose: true,
          message: `File deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListFile' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
