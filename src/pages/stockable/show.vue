<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <router-link :to="{ name: 'ListStockable' }">Stockables</router-link>
  </div>

  <div slot="card-header">
    <div class="brief">
      <div class="avatar">
        <img :src="avatarUrl">
      </div>

      <div class="detail">
        <p>
          <span>Stockable</span>
          <span>{{stockable.code}}</span>
        </p>
        <h1>{{stockable.name}}</h1>
        <p class="id">{{stockable.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditStockable', params: { id: this.stockable.id } }" class="el-button el-button--small is-plain">
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
            <dd>{{stockable.id}}</dd>

            <dt>Code</dt>
            <dd>{{stockable.code}}</dd>

            <dt>Status</dt>
            <dd>{{stockable.status}}</dd>

            <dt>Name</dt>
            <dd>{{stockable.name}}</dd>

            <dt>Print Name</dt>
            <dd>{{stockable.printName}}</dd>

            <dt>Unit of Measure</dt>
            <dd>{{stockable.unitOfMeasure}}</dd>

            <dt>Variable Weight</dt>
            <dd>{{stockable.variableWeight}}</dd>

            <dt>Storage Type</dt>
            <dd>{{stockable.storageType}}</dd>

            <dt>Stackable</dt>
            <dd>{{stockable.stackable}}</dd>

            <dt>Storage Size</dt>
            <dd>{{stockable.storageSize}}</dd>

            <dt>Storage Description</dt>
            <dd>{{stockable.storageDescription}}</dd>

            <dt>Specification</dt>
            <dd>{{stockable.specification}}</dd>

            <dt>Caption</dt>
            <dd>{{stockable.caption}}</dd>

            <dt>Description</dt>
            <dd>{{stockable.description}}</dd>
          </dl>
        </div>
      </div>

      <file-collection-block
        :owner="stockable"
        :records="fileCollections"
        @deleted="loadStockable()"
      >
      </file-collection-block>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{stockable.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <dt v-if="stockable.avatar">Avatar</dt>
            <dd v-if="stockable.avatar">
              <router-link :to="{ name: 'ShowFile', params: { id: stockable.avatar.id }}">
               {{stockable.avatar.id}}
              </router-link>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteStockable()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteStockable" title="Delete stockable" width="500px" class="delete-stockable">
      <p>
        Are you sure you want to delete this stockable? If you delete this stockable,
        all of the following related resources if any will also be deleted:

        <ul>
          <li>All products that contain this stockable</li>
          <li>All file collections that are owned by this stockable and all files inside those collection</li>
          <li>File that is the avatar of this stockable</li>
        </ul>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingStockable" @click="cancelDeleteStockable()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingStockable" @click="deleteStockable()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import Stockable from '@/models/stockable'
import FileCollectionBlock from '@/components/file-collection-block'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadStockable' })

export default {
  name: 'ShowStockable',
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
      stockable: Stockable.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteStockable: false,
      isDeletingStockable: false
    }
  },
  created () {
    this.loadStockable()
  },
  computed: {
    avatarUrl () {
      if (this.stockable.avatar) {
        return this.stockable.avatar.url
      }

      return 'https://placehold.it/80x80'
    },

    fileCollections () {
      if (!this.stockable.fileCollections) { return [] }

      return this.stockable.fileCollections
    }
  },
  methods: {
    loadStockable () {
      this.isLoading = true

      return freshcom.retrieveStockable(this.id, {
        include: 'avatar,fileCollections'
      }).then(response => {
        this.stockable = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    attemptDeleteStockable () {
      this.isConfirmingDeleteStockable = true
    },

    cancelDeleteStockable () {
      this.isConfirmingDeleteStockable = false
    },

    deleteStockable () {
      this.isDeletingStockable = true

      freshcom.deleteStockable(this.stockable.id).then(() => {
        this.isDeletingStockable = false

        this.$message({
          showClose: true,
          message: `Stockable deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingStockable = false
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListStockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
