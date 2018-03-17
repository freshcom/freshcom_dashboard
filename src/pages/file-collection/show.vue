<template>
<content-container @locale-changed="reload" :ready="isReady">
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
          <h2>Files <small>({{fileCollection.fileCount}})</small></h2>

          <div class="action-group">
            <el-button @click.native="addFile()" plain size="mini">
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="memberships" class="data-table block-table" :show-header="false">
            <el-table-column>
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFile', params: { id: scope.row.file.id }, query: { callbackPath: currentRoutePath } }" class="primary">
                  <span>{{scope.row.file.name}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="150">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFile', params: { id: scope.row.file.id }, query: { callbackPath: currentRoutePath } }">
                  <span>{{scope.row.file.contentType}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="200">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFile', params: { id: scope.row.file.id }, query: { callbackPath: currentRoutePath } }">
                  <span>{{scope.row.file.updatedAt | moment}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <el-button @click.native="editMembership(scope.row)" plain size="mini">
                      Edit
                    </el-button>
                    <el-button @click.native="attemptDeleteMembership(scope.row)" plain size="mini">Remove</el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="memberships.length >= 5" class="foot text-center">
            <a class="view-more" href="#">View More</a>
          </div>
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
                {{fileCollection.owner.type}} - {{fileCollection.owner.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click.native="attemptDeleteCollection()" plain size="small">Delete</el-button>
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
            Upload new files
          </router-link>
        </p>

        <div slot="footer">
          <el-button :disabled="isCreatingMembership" @click="cancelAddFile()" plain size="small">Cancel</el-button>
        </div>
      </el-dialog>

      <el-dialog :show-close="false" :visible="isAddingMembership" title="Add existing file to collection" width="600px">
        <el-form @submit.native.prevent="createMembership()" label-width="150px" size="small">
          <file-collection-membership-fieldset v-model="membershipForAdd" :errors="errors"></file-collection-membership-fieldset>
        </el-form>

        <div slot="footer">
          <el-button :disabled="isCreatingMembership" @click="cancelAddMembership()" plain size="small">Cancel</el-button>
          <el-button :loading="isCreatingMembership" @click="createMembership()" type="primary" size="small">Save</el-button>
        </div>
      </el-dialog>

      <el-dialog :show-close="false" :visible="isEditingMembership" title="Edit file membership" width="600px">
        <el-form @submit.native.prevent="updateMembership()" label-width="150px" size="small">
          <file-collection-membership-fieldset v-model="membershipForEdit" :errors="errors"></file-collection-membership-fieldset>
        </el-form>

        <div slot="footer">
          <el-button :disabled="isUpdatingMembership" @click="cancelEditMembership()" plain size="small">Cancel</el-button>
          <el-button :loading="isUpdatingMembership" @click="updateMembership()" type="primary" size="small">Save</el-button>
        </div>
      </el-dialog>

      <el-dialog :show-close="false" :visible="isConfirmingDeleteMembership" title="Remove file from collection" width="500px">
        <p>
          Are you sure you want to remove this file from the collection?
          By default the file itself will not be deleted. If you also want
          to delete the file click on &quot;Remove and delete file&quot;.

          <br/><br/>
          <b>File deletion cannot be undone.</b>
        </p>

        <div slot="footer">
          <el-button :disabled="isDeletingMembership" @click="cancelDeleteMembership()" plain size="small">Cancel</el-button>
          <el-button :loading="isDeletingMembership" @click="deleteFile()" type="danger" size="small">Remove and delete file</el-button>
          <el-button :loading="isDeletingMembership" @click="deleteMembership()" plain size="small">Remove</el-button>
        </div>
      </el-dialog>

      <el-dialog :show-close="false" :visible="isConfirmingDeleteCollection" title="Delete collection" width="500px">
        <p>
          Are you sure you want to delete this file collection?
          All files inside the collection will also be deleted.
          If you want to keep certain files, remove them from this collection
          before deletion.
          <br/><br/>
          File deletion will run in the background and may take some time to finish.

          <br/><br/>
          <b>This action cannot be undone.</b>
        </p>

        <div slot="footer">
          <el-button :disabled="isDeletingCollection" @click="cancelDeleteCollection()" plain size="small">Cancel</el-button>
          <el-button :loading="isDeletingCollection" @click="deleteCollection()" type="danger" size="small">Delete</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>
</template>

<script>
import _ from 'lodash'
import freshcom from '@/freshcom-sdk'

import FileCollection from '@/models/file-collection'
import FileCollectionMembershipFieldset from '@/components/file-collection-membership-fieldset'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadFileCollection' })

export default {
  name: 'ShowFileCollection',
  mixins: [ResourcePageMixin],
  components: {
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

      isAddingFile: false,

      isAddingMembership: false,
      isCreatingMembership: false,
      membershipForAdd: { type: 'FileCollectionMembership', code: '', sortIndex: 0 },

      isEditingMembership: false,
      isUpdatingMembership: false,
      membershipForEdit: {},

      isDeletingMembership: false,
      isConfirmingDeleteMembership: false,
      membershipForDelete: {},

      isDeletingCollection: false,
      isConfirmingDeleteCollection: false,

      errors: {}
    }
  },
  computed: {
    memberships () {
      if (this.fileCollection && this.fileCollection.memberships) {
        return this.fileCollection.memberships
      }

      return []
    }
  },
  methods: {
    loadFileCollection () {
      this.isLoading = true

      return freshcom.retrieveFileCollection(this.id, {
        include: 'memberships.file'
      }).then(response => {
        this.fileCollection = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
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
      this.membershipForAdd = { type: 'FileCollectionMembership', code: '', sortIndex: 0 }
      this.isAddingMembership = false
    },

    createMembership () {
      this.isCreatingMembership = true

      return freshcom.createFileCollectionMembership(this.fileCollection.id, this.membershipForAdd).then(() => {
        return this.loadFileCollection()
      }).then(() => {
        this.$message({
          showClose: true,
          message: `File added successfully.`,
          type: 'success'
        })

        this.isCreatingMembership = false
        this.cancelAddMembership()
      }).catch(response => {
        this.errors = response.errors
        this.isCreatingMembership = false
      })
    },

    editMembership (membership) {
      this.isEditingMembership = true
      this.membershipForEdit = _.cloneDeep(membership)
    },

    cancelEditMembership () {
      this.isEditingMembership = false
    },

    updateMembership () {
      this.isUpdatingMembership = true

      return freshcom.updateFileCollectionMembership(this.membershipForEdit.id, this.membershipForEdit).then(() => {
        return this.loadFileCollection()
      }).then(() => {
        this.cancelEditMembership()
        this.isUpdatingMembership = false
        this.membershipForEdit = {}

        this.$message({
          showClose: true,
          message: `File membership updated successfully.`,
          type: 'success'
        })
      }).catch(response => {
        this.errors = response.errors
        this.isUpdatingMembership = false
      })
    },

    attemptDeleteMembership (membership) {
      this.isConfirmingDeleteMembership = true
      this.membershipForDelete = membership
    },

    cancelDeleteMembership () {
      this.isConfirmingDeleteMembership = false
    },

    deleteMembership () {
      this.isDeletingMembership = true

      return freshcom.deleteFileCollectionMembership(this.membershipForDelete.id).then(() => {
        return this.loadFileCollection()
      }).then(() => {
        this.cancelDeleteMembership()
        this.isDeletingMembership = false
        this.membershipForDelete = {}

        this.$message({
          showClose: true,
          message: `File removed from collection successfully.`,
          type: 'success'
        })
      }).catch(() => {
        this.isDeletingMembership = false
      })
    },

    deleteFile () {
      this.isDeletingMembership = true

      return freshcom.deleteFile(this.membershipForDelete.file.id).then(() => {
        return this.loadFileCollection()
      }).then(() => {
        this.cancelDeleteMembership()
        this.isDeletingMembership = false
        this.membershipForDelete = {}

        this.$message({
          showClose: true,
          message: `File deleted successfully.`,
          type: 'success'
        })
      }).catch(() => {
        this.isDeletingMembership = false
      })
    },

    attemptDeleteCollection () {
      this.isConfirmingDeleteCollection = true
    },

    cancelDeleteCollection () {
      this.isConfirmingDeleteCollection = false
    },

    deleteCollection (opts = { }) {
      this.isDeletingCollection = true

      freshcom.deleteFileCollection(this.fileCollection.id).then(() => {
        this.isDeletingCollection = false
        this.$message({
          showClose: true,
          message: `File collection deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingCollection = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
