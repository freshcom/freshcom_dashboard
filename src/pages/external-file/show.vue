<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="files" mode="horizontal">
        <el-menu-item :route="{ name: 'ListExternalFile' }" index="files">Files</el-menu-item>
        <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="file_collections">Collections</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">

            <div class="brief">
              <div class="avatar">
                <img v-if="isImage(record)" :src="record.url">
                <icon v-else name="file" class="avatar-icon"></icon>
              </div>

              <div class="detail">
                <p>{{record.code}}</p>
                <h2>{{record.name}}</h2>
                <p class="id">{{record.id}}</p>
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
                  <dd>{{record.id}}</dd>

                  <dt>Status</dt>
                  <dd>{{record.status}}</dd>

                  <dt>Name</dt>
                  <dd>{{record.name}}</dd>

                  <dt>Content Type</dt>
                  <dd>{{record.contentType}}</dd>

                  <dt>Size</dt>
                  <dd>{{record.sizeBytes}} bytes</dd>

                  <dt>Public Readable</dt>
                  <dd>{{record.publicReadable}}</dd>

                  <dt>Version Name</dt>
                  <dd>{{record.versionName}}</dd>

                  <dt>Version Label</dt>
                  <dd>{{record.versionLabel}}</dd>

                  <dt>URL</dt>
                  <dd><a :href="record.url" target="_blank">Click to open</a></dd>
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
            <delete-button @confirmed="deleteRecord">Delete</delete-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/file'

import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowExternalFile',
  components: {
    DeleteButton
  },
  mixins: [ShowPage({ storeNamespace: 'externalFile', name: 'File' })],
  methods: {
    isImage(externalFile) {
      return externalFile.contentType.startsWith('image/')
    },
    recordDeleted() {
      this.$store.dispatch('pushRoute', { name: 'ListExternalFile' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
