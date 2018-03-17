<template>
<content-container @locale-changed="loadFileCollection" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListFileCollection' }">File Collections</router-link>
    <router-link :to="{ name: 'ListFile' }">Files</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <icon name="folder" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>File Collection</span>
          <span>{{fileCollection.code}}</span>
        </p>
        <h1>{{fileCollection.name}}</h1>
        <p class="id">{{fileCollection.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditFileCollection', params: { id: this.fileCollection.id } }" class="el-button el-button--small is-plain">
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
            <dd>{{fileCollection.id}}</dd>

            <dt>Name</dt>
            <dd>{{fileCollection.name}}</dd>

            <dt>Label</dt>
            <dd>{{fileCollection.label}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Files</h2>

          <div class="action-group">
            <el-button @click.native="addFile()" plain size="mini">
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="fileCollection.files" class="block-table" :show-header="false">
            <el-table-column>
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>

            <el-table-column width="150">
              <template slot-scope="scope">
                <span>{{scope.row.contentType}}</span>
              </template>
            </el-table-column>

            <el-table-column width="120">
              <template slot-scope="scope">
                <span>{{scope.row.sizeBytes}} Bytes</span>
              </template>
            </el-table-column>

            <el-table-column width="200">
              <template slot-scope="scope">
                <span>{{scope.row.updatedAt | moment}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{fileCollection.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="fileCollection.owner">Owner</dt>
            <dd v-if="fileCollection.owner">
              <router-link :to="{ name: `Show${fileCollection.owner.type}`, params: { id: fileCollection.owner.id }}">
                {{fileCollection.owner.id}} ({{fileCollection.owner.type}})
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <confirm-button @confirmed="deleteFileCollection()" plain size="small">Delete</confirm-button>
    </div>

    <div class="launchable">
      <el-dialog :show-close="false" :visible="isAddingFile" title="Add file" width="600px">
        <p class="text-center">
          <el-button @click.native="addMembership()" size="small" type="primary">Add from existing file</el-button>
        </p>

        <div class="divider-text">
          <span class="text">Or</span>
        </div>

        <p class="text-center">
          <router-link :to="{ name: 'NewFile', params: { collectionId: this.fileCollection.id } }" class="el-button el-button--small el-button--primary">
            Create a new file
          </router-link>
        </p>

        <div slot="footer">
          <el-button :disabled="isCreatingMembership" @click="cancelAddFile()" plain size="small">Cancel</el-button>
        </div>
      </el-dialog>

      <el-dialog :show-close="false" :visible="isAddingMembership" title="Add existing file to collection" width="600px">
        <el-form @submit.native.prevent="createMembership()" label-width="150px" size="small">
          <file-collection-membership-fieldset v-model="membership" :errors="errors"></file-collection-membership-fieldset>
        </el-form>

        <div slot="footer">
          <el-button :disabled="isCreatingMembership" @click="cancelAddMembership()" plain size="small">Cancel</el-button>
          <el-button :loading="isCreatingMembership" @click="createMembership()" type="primary" size="small">Save</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import FileCollection from '@/models/file-collection'
import ConfirmButton from '@/components/confirm-button'
import FileCollectionMembershipFieldset from '@/components/file-collection-membership-fieldset'

export default {
  name: 'ShowFileCollection',
  mixins: [PageMixin],
  components: {
    ConfirmButton,
    FileCollectionMembershipFieldset
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fileCollection: FileCollection.objectWithDefaults(),
      isLoading: false,
      isReady: false,

      isAddingFile: false,

      isAddingMembership: false,
      isCreatingMembership: false,
      membership: { type: 'FileCollectionMembership', code: '', sortIndex: 0 },

      errors: {}
    }
  },
  created () {
    this.loadFileCollection()
  },
  methods: {
    loadFileCollection () {
      this.isLoading = true

      freshcom.retrieveFileCollection(this.id, {
        include: 'files'
      }).then(response => {
        this.fileCollection = response.data
        this.isLoading = false
        this.isReady = true
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    deleteFileCollection () {
      freshcom.deleteFileCollection(this.fileCollection.id).then(() => {
        this.$message({
          showClose: true,
          message: `File collection deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListFileCollection' })
    },

    addFile () {
      this.isAddingFile = true
    },

    cancelAddFile () {
      this.isAddingFile = false
    },

    addMembership () {
      this.isAddingFile = false
      this.isAddingMembership = true
    },

    cancelAddMembership () {
      this.isAddingMembership = false
    },

    createMembership () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
