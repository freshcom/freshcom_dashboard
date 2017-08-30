<template>
<div class="main-col">
  <div class="content">

    <div class="secondary-nav">
      <el-menu :router="true" default-active="/file_collections" mode="horizontal">
        <el-menu-item :route="{ name: 'ListExternalFileCollection' }" index="/file_collections">Collections</el-menu-item>
      </el-menu>
      <locale-selector></locale-selector>
    </div>

    <div class="main-scroller">
      <div class="main">
        <el-card v-loading="isLoading" class="main-card">
          <div slot="header">

            <div class="brief">
              <div class="avatar">
                <icon name="folder" class="avatar-icon"></icon>
              </div>

              <div class="detail">
                <p>{{record.code}}</p>
                <h2>{{record.name}}</h2>
                <p class="id">{{record.id}}</p>
              </div>
            </div>

            <div class="header-actions">
              <el-button @click="editRecord()">Edit</el-button>
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

                  <dt>Name</dt>
                  <dd>{{record.name}}</dd>

                  <dt>Label</dt>
                  <dd>{{record.label}}</dd>
                </dl>
              </div>
            </div>

             <div class="block-title">
              <h3>Files</h3>
            </div>
            <div class="block">
              <div class="block-body">
                <template v-for="file in record.files">
                  <div class="file-thumbnail">
                    <div>
                      <div class="wrapper">
                        <img v-if="isImage(file)" :src="file.url">
                        <icon v-else name="file" class="file-icon"></icon>
                      </div>
                    </div>
                    <div class="caption">
                      <span>{{file.name}}</span>
                    </div>
                  </div>
                </template>
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
import 'vue-awesome/icons/folder'

import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'

export default {
  name: 'ShowExternalFileCollection',
  components: {
    DeleteButton
  },
  mixins: [ShowPage({ storeNamespace: 'externalFileCollection', name: 'File Collection', include: 'files' })],
  methods: {
    isImage (record) {
      return record.contentType.startsWith('image/')
    },
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditExternalFileCollection', params: { id: this.record.id } })
    },
    recordDeleted (record) {
      this.$store.dispatch('pushRoute', { name: 'ListExternalFileCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
