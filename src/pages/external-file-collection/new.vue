<template>
<div class="page-warpper">
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
    <el-card class="main-card">
      <div slot="header">
        <span style="line-height: 36px;">Create a file collection</span>

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

        <el-button @click="submit()" type="primary" class="pull-right" size="small">
          Save
        </el-button>
      </div>
    </el-card>
  </div>
</div>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import ExternalFileCollection from '@/models/external-file-collection'
import ExternalFileCollectionForm from '@/components/external-file-collection-form'

export default {
  name: 'NewExternalFileCollection',
  props: ['ownerId', 'ownerType'],
  components: {
    ExternalFileCollectionForm
  },
  data () {
    return {
      efcDraft: ExternalFileCollection.objectWithDefaults(),
      isCreatingEfc: false,
      errors: {}
    }
  },
  created () {
    if (this.ownerId && this.ownerType) {
      this.efcDraft.owner = { id: this.ownerId, type: this.ownerType }
    }
  },
  methods: {
    submit () {
      this.isCreatingEfc = true

      freshcom.createExternalFileCollection(this.efcDraft).then(response => {
        this.$message({
          showClose: true,
          message: `File collection created successfully.`,
          type: 'success'
        })

        this.isCreatingEfc = false
        this.back()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingEfc = false
        throw response
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListExternalFileCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
