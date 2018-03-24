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

      <file-collection-block
        :owner="unlockable"
        :records="fileCollections"
        @deleted="loadUnlockable()"
      >
      </file-collection-block>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{unlockable.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="unlockable.avatar">Avatar</dt>
            <dd v-if="unlockable.avatar">
              <router-link :to="{ name: 'ShowFile', params: { id: unlockable.avatar.id }}">
               {{unlockable.avatar.id}}
              </router-link>
            </dd>

            <dt v-if="unlockable.file">File</dt>
            <dd v-if="unlockable.file">
              <router-link :to="{ name: 'ShowFile', params: { id: unlockable.file.id }}">
               {{unlockable.file.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteUnlockable()" plain size="small">Delete</el-button>
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
            <li>File that is the avatar of this unlockable</li>
            <li>Any file associated with this unlockable</li>
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
import FileCollectionBlock from '@/components/file-collection-block'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadUnlockable' })

export default {
  name: 'ShowUnlockable',
  mixins: [ResourcePageMixin],
  components: {
    FileCollectionBlock
  },
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

    attemptDeleteFileCollection (fileCollection) {
      this.isConfirmingDeleteFileCollection = true
      this.fileCollectionForDelete = fileCollection
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
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListUnlockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
