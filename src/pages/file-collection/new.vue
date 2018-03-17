<template>
<content-container>
  <div slot="header">
    <router-link :to="{ name: 'ListFileCollection' }">File Collections</router-link>
    <router-link :to="{ name: 'ListFile' }">Files</router-link>
  </div>

  <div slot="card-header">
    <h1>Create a file collection</h1>

    <div class="pull-right">
      <el-button @click="back()" plain size="small">
        Cancel
      </el-button>

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small">
        Save
      </el-button>
    </div>
  </div>

  <div slot="card-content">
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

      <el-button :loading="isCreating" @click="submit()" type="primary" size="small" class="pull-right">
        Save
      </el-button>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import FileCollection from '@/models/file-collection'
import FileCollectionFieldset from '@/components/file-collection-fieldset'

export default {
  name: 'NewFileCollection',
  mixins: [PageMixin],
  components: {
    FileCollectionFieldset
  },
  props: {
    owner: {
      type: Object
    }
  },
  data () {
    return {
      fileCollectionDraft: FileCollection.objectWithDefaults(),
      isCreating: false,
      errors: {}
    }
  },
  created () {
    if (this.owner) {
      this.fileCollectionDraft.owner = this.owner
    }
  },
  methods: {
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
      this.$store.dispatch('pushRoute', { name: 'ListFileCollection' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
