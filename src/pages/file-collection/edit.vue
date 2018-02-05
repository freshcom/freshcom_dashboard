<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/file_collections" mode="horizontal" class="secondary-nav">
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

        <span style="line-height: 36px;">Edit File Collection</span>

        <div class="pull-right">
          <el-button @click="back()" plain size="small">
            Cancel
          </el-button>

          <el-button @click="submit()" type="primary" size="small">
            Save
          </el-button>
        </div>
      </div>

      <div class="data">
        <file-collection-form v-model="efcDraft" :errors="errors"></file-collection-form>
      </div>

      <div class="footer">
        <el-button @click="back()" plain size="small">
          Cancel
        </el-button>

        <el-button @click="submit()" size="small" type="primary" class="pull-right">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import FileCollectionForm from '@/components/file-collection-form'
import FileCollection from '@/models/file-collection'

export default {
  name: 'EditFileCollection',
  mixins: [PageMixin],
  components: {
    FileCollectionForm
  },
  props: ['id'],
  data () {
    return {
      isLoading: false,
      efc: FileCollection.objectWithDefaults(),
      efcDraft: FileCollection.objectWithDefaults(),

      isUpadingEfc: false,
      errors: {}
    }
  },
  created () {
    this.loadEfc()
  },
  methods: {
    loadEfc () {
      this.isLoading = true

      freshcom.retrieveFileCollection(this.id, {
        include: 'files'
      }).then(response => {
        this.efc = response.data
        this.efcDraft = _.cloneDeep(response.data)
        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    },
    submit () {
      this.isUpdatingEfc = true

      freshcom.updateFileCollection(
        this.efcDraft.id,
        this.efcDraft
      ).then(efc => {
        this.$message({
          showClose: true,
          message: `File collection saved successfully.`,
          type: 'success'
        })

        this.isUpdatingEfc = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingEfc = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ShowFileCollection', params: { id: this.efc.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
