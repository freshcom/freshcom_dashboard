<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListDepositable'}">Depositables</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <img :src="avatarUrl">
      </div>

      <div class="detail">
        <p>
          <span>Depositable</span>
          <span>{{depositable.code}}</span>
        </p>
        <h1>{{depositable.name}}</h1>
        <p class="id">{{depositable.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditDepositable', params: { id: this.depositable.id } }" class="el-button el-button--small is-plain">
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
            <dd>{{depositable.id}}</dd>

            <template v-if="depositable.code">
              <dt>Code</dt>
              <dd>{{depositable.code}}</dd>
            </template>

            <dt>Status</dt>
            <dd>{{depositable.status}}</dd>

            <dt>Name</dt>
            <dd>{{depositable.name}}</dd>

            <dt>Print Name</dt>
            <dd>{{depositable.printName}}</dd>

            <dt>Amount</dt>
            <dd>{{depositable.amount}}</dd>

            <dt>Caption</dt>
            <dd>{{depositable.caption}}</dd>

            <dt>Description</dt>
            <dd>{{depositable.description}}</dd>
          </dl>
        </div>
      </div>

      <file-collection-block
        :owner="depositable"
        :records="fileCollections"
        @deleted="loadDepositable()"
      >
      </file-collection-block>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{depositable.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="depositable.avatar">Avatar</dt>
            <dd v-if="depositable.avatar">
              <router-link :to="{ name: 'ShowFile', params: { id: depositable.avatar.id }}">
               {{depositable.avatar.id}}
              </router-link>
            </dd>

            <dt v-if="depositable.file">File</dt>
            <dd v-if="depositable.file">
              <router-link :to="{ name: 'ShowFile', params: { id: depositable.file.id }}">
               {{depositable.file.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteDepositable()" plain size="small">Delete</el-button>
    </div>

    <div class="launchable">
      <el-dialog :show-close="false" :visible="isConfirmingDeleteDepositable" title="Delete depositable" width="500px">
        <p>
          Are you sure you want to delete this depositable? If you delete this depositable,
          all of the following related resources if any will also be deleted:

          <ul>
            <li>All products that contain this depositable</li>
            <li>All file collections that are owned by this depositable and all files inside those collection</li>
            <li>File that is the avatar of this depositable</li>
          </ul>

          <b>This action cannot be undone.</b>
        </p>

        <div slot="footer">
          <el-button :disabled="isDeletingDepositable" @click="cancelDeleteDepositable()" plain size="small">Cancel</el-button>
          <el-button :loading="isDeletingDepositable" @click="deleteDepositable()" type="danger" size="small">Delete</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Depositable from '@/models/depositable'
import FileCollectionBlock from '@/components/file-collection-block'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadDepositable' })

export default {
  name: 'ShowDepositable',
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
      depositable: Depositable.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteDepositable: false,
      isDeletingDepositable: false
    }
  },
  created () {
    this.loadDepositable()
  },
  computed: {
    avatarUrl () {
      if (this.depositable.avatar) {
        return this.depositable.avatar.url
      }

      return 'https://placehold.it/80x80'
    },

    fileCollections () {
      if (!this.depositable.fileCollections) { return [] }

      return this.depositable.fileCollections
    }
  },
  methods: {
    loadDepositable () {
      this.isLoading = true

      return freshcom.retrieveDepositable(this.id, {
        include: 'avatar,fileCollections'
      }).then(response => {
        this.depositable = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    attemptDeleteDepositable () {
      this.isConfirmingDeleteDepositable = true
    },

    cancelDeleteDepositable () {
      this.isConfirmingDeleteDepositable = false
    },

    deleteDepositable () {
      this.isDeletingDepositable = true

      freshcom.deleteDepositable(this.depositable.id).then(() => {
        this.isDeletingDepositable = false
        this.$message({
          showClose: true,
          message: `Depositable deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingDepositable = false
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListDepositable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
