<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListUnlockable'}">Unlockables</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <img :src="avatarUrl">
      </div>

      <div class="detail">
        <p>
          <span>Unlockable</span>
          <span>{{unlockable.code}}</span>
        </p>
        <h1>{{unlockable.name}}</h1>
        <p class="id">{{unlockable.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditUnlockable', params: { id: this.unlockable.id } }" class="el-button el-button--small is-plain">
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
            <dd>{{unlockable.id}}</dd>

            <template v-if="unlockable.code">
              <dt>Code</dt>
              <dd>{{unlockable.code}}</dd>
            </template>

            <dt>Status</dt>
            <dd>{{unlockable.status}}</dd>

            <dt>Name</dt>
            <dd>{{unlockable.name}}</dd>

            <dt>Print Name</dt>
            <dd>{{unlockable.printName}}</dd>

            <dt>Caption</dt>
            <dd>{{unlockable.caption}}</dd>

            <dt>Description</dt>
            <dd>{{unlockable.description}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>File Collections</h2>

          <div class="action-group">
            <router-link :to="{ name: 'NewFileCollection', query: { owner: { id: this.unlockable.id, type: 'Unlockable', name: this.unlockable.name }, callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
              Add
            </router-link>
          </div>
        </div>

        <div class="body full">
          <el-table :data="fileCollections" class="data-table block-table" :show-header="false">
            <el-table-column width="300">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="primary">
                  <span>{{scope.row.name}}</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column width="100">
              <template slot-scope="scope">
                <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }">
                  <span>{{scope.row.fileCount}} files</span>
                </router-link>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <p class="action-group">
                  <el-button-group>
                    <router-link :to="{ name: 'EditFileCollection', params: { id: scope.row.id }, query: { callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                      Edit
                    </router-link>
                    <el-button plain size="mini">Delete</el-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>

          <div v-if="fileCollections.length >= 5" class="foot text-center">
            <a class="view-more" href="#">View More</a>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{unlockable.customData}}
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click.native="attemptDeleteUnlockable()" plain size="small">Delete</el-button>
    </div>

    <div class="launchable">
      <el-dialog :show-close="false" :visible="isConfirmingDeleteUnlockable" title="Delete unlockable" width="500px">
        <p>
          Are you sure you want to delete this unlockable? If you delete this unlockable,
          all of the following related resources if any will also be deleted:

          <ul>
            <li>All unlocks that are associated with this unlockable</li>
            <li>All products that contain this unlockable</li>
            <li>All file collections that are owned by this unlockable and all files inside those collection</li>
          </ul>

          <b>This action cannot be undone.</b>
        </p>

        <div slot="footer">
          <el-button :disabled="isDeletingUnlockable" @click="cancelDeleteUnlockable()" plain size="small">Cancel</el-button>
          <el-button :loading="isDeletingUnlockable" @click="deleteUnlockable()" type="danger" size="small">Delete</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Unlockable from '@/models/unlockable'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadUnlockable' })

export default {
  name: 'ShowUnlockable',
  mixins: [ResourcePageMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      unlockable: Unlockable.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteUnlockable: false,
      isDeletingUnlockable: false
    }
  },
  computed: {
    avatarUrl () {
      if (this.unlockable.avatar) {
        return this.unlockable.avatar.url
      }

      return 'https://placehold.it/80x80'
    },

    fileCollections () {
      if (!this.unlockable.fileCollections) { return [] }

      return this.unlockable.fileCollections
    }
  },
  methods: {
    loadUnlockable () {
      this.isLoading = true

      return freshcom.retrieveUnlockable(this.id, {
        include: 'avatar,fileCollections'
      }).then(response => {
        this.unlockable = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListUnlockable' })
    },

    attemptDeleteUnlockable () {
      this.isConfirmingDeleteUnlockable = true
    },

    cancelDeleteUnlockable () {
      this.isConfirmingDeleteUnlockable = false
    },

    deleteUnlockable () {
      this.isDeletingUnlockable = true

      freshcom.deleteUnlockable(this.unlockable.id).then(() => {
        this.isDeletingUnlockable = false
        this.$message({
          showClose: true,
          message: `Unlockable deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingUnlockable = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
