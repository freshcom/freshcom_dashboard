<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/file_collections" mode="horizontal" class="secondary-nav">
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
        <external-file-collection-form v-model="efcDraft" :errors="errors"></external-file-collection-form>
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
import ExternalFileCollectionForm from '@/components/external-file-collection-form'
import ExternalFileCollection from '@/models/external-file-collection'

export default {
  name: 'EditExternalFileCollection',
  props: ['id'],
  components: {
    ExternalFileCollectionForm
  },
  data () {
    return {
      isLoading: false,
      efc: ExternalFileCollection.objectWithDefaults(),
      efcDraft: ExternalFileCollection.objectWithDefaults(),

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

      freshcom.retrieveExternalFileCollection(this.id, {
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

      freshcom.updateExternalFileCollection(
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
      this.$store.dispatch('pushRoute', { name: 'ShowExternalFileCollection', params: { id: this.efc.id } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
