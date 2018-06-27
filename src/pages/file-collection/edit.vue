<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/file-collections" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListFileCollection' }" index="/file-collections">
        Collections
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListFile' }" index="/files">
        Files
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <h1>Edit file collection</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <el-row>
        <el-col :span="14" :offset="5">
          <el-form @submit.native.prevent="submit()" label-width="60px" size="small">
            <file-collection-fieldset v-model="fileCollectionDraft" :errors="errors"></file-collection-fieldset>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isUpdating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import FileCollectionFieldset from '@/components/file-collection-fieldset'
import FileCollection from '@/models/file-collection'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadFileCollection' })

export default {
  name: 'EditFileCollection',
  mixins: [ResourcePageMixin],
  components: {
    FileCollectionFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      fileCollection: FileCollection.objectWithDefaults(),
      fileCollectionDraft: FileCollection.objectWithDefaults(),

      isUpdating: false,
      errors: {}
    }
  },
  methods: {
    loadFileCollection () {
      this.isLoading = true

      return freshcom.retrieveFileCollection(this.id).then(response => {
        this.fileCollection = response.data
        this.fileCollectionDraft = _.cloneDeep(response.data)
        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    },

    submit () {
      this.isUpdating = true

      freshcom.updateFileCollection(
        this.fileCollectionDraft.id,
        this.fileCollectionDraft
      ).then(fileCollection => {
        this.$message({
          showClose: true,
          message: `File collection saved successfully.`,
          type: 'success'
        })

        this.isUpdating = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdating = false
        throw response
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ShowFileCollection', params: { id: this.fileCollection.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
