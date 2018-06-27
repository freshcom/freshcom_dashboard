<template>
<content-container @locale-changed="reload" :ready="isReady">
  <div slot="header">
    <el-menu :router="true" default-active="/fulfillment-packages" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListFulfillmentPackage' }" index="/fulfillment-packages">
        Fulfillments
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListReturnPackage' }" index="/returns">
        Returns
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <div class="brief">
      <div class="avatar">
        <icon name="shopping-bag" class="avatar-icon"></icon>
      </div>

      <div class="detail">
        <p>
          <span>Fulfillment Package</span>
          <span>{{fulfillmentPackage.code}}</span>
        </p>
        <h1>{{fulfillmentPackage.name}}</h1>
        <p class="id">{{fulfillmentPackage.id}}</p>
      </div>
    </div>

    <div class="brief-action-group">
      <router-link :to="{ name: 'EditFulfillmentPackage', params: { id: this.fulfillmentPackage.id } }" class="el-button el-button--small is-plain">
        Edit
      </router-link>
    </div>
  </div>

  <div slot="content-body">
    <div class="data">
      <div class="block">
        <div class="header">
          <h2>Detail</h2>
        </div>

        <div class="body">
          <dl>
            <dt>ID</dt>
            <dd>{{fulfillmentPackage.id}}</dd>

            <template v-if="fulfillmentPackage.code">
              <dt>Code</dt>
              <dd>{{fulfillmentPackage.code}}</dd>
            </template>

            <dt>Status</dt>
            <dd>{{fulfillmentPackage.status}}</dd>

            <dt>Name</dt>
            <dd>{{fulfillmentPackage.name}}</dd>

            <dt>System Label</dt>
            <dd>{{fulfillmentPackage.systemLabel}}</dd>

            <dt>Label</dt>
            <dd>{{fulfillmentPackage.label}}</dd>

            <dt>Caption</dt>
            <dd>{{fulfillmentPackage.caption}}</dd>

            <dt>Description</dt>
            <dd>{{fulfillmentPackage.description}}</dd>
          </dl>
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Items</h2>

          <div class="action-group">
            <el-button @click="addItem()" size="mini" plain>
              Add
            </el-button>
          </div>
        </div>

        <div class="body full">
          <el-table :data="items" class="data-table block-table" :show-header="false">
            <el-table-column width="300px">
              <template slot-scope="scope">
                <a href="javascript:;" class="primary">
                  <span>{{scope.row.name}}</span>
                </a>
              </template>
            </el-table-column>

            <el-table-column width="100px">
              <template slot-scope="scope">
                x {{scope.row.quantity}}
              </template>
            </el-table-column>

            <el-table-column>
              <template slot-scope="scope">
                <span v-if="scope.row.source">{{scope.row.source.type}}</span>
              </template>
            </el-table-column>

            <el-table-column align="right" width="140">
              <template slot-scope="scope">
               <p class="action-group">
                  <el-button-group>
                    <confirm-button v-if="scope.row.status === 'pending'" size="mini">
                      Fulfill
                    </confirm-button>

                    <confirm-button v-if="scope.row.status === 'fulfilled'" @confirmed="returnFulfillmentItem(scope.row)" confirm-button-text="Yes" size="mini">
                      Return
                    </confirm-button>

                    <confirm-button v-if="scope.row.status === 'fulfilled'" @confirmed="discardFulfillmentItem(scope.row)" confirm-button-text="Yes" size="mini">
                      Discard
                    </confirm-button>

                    <confirm-button v-if="scope.row.status === 'pending'" size="mini">
                      Delete
                    </confirm-button>
                  </el-button-group>
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <file-collection-block
        :owner="fulfillmentPackage"
        :records="fileCollections"
        @deleted="loadFulfillmentPackage()"
      >
      </file-collection-block>

      <div class="block">
        <div class="header">
          <h2>Custom Data</h2>
        </div>
        <div class="body">
          {{fulfillmentPackage.customData}}
        </div>
      </div>

      <div class="block">
        <div class="header">
          <h2>Related Resources</h2>
        </div>
        <div class="body">
          <dl>
            <template v-if="fulfillmentPackage.customer">
              <dt>Customer</dt>
              <dd>
                <router-link :to="{ name: 'ShowCustomer', params: { id: fulfillmentPackage.customer.id }}">
                 {{fulfillmentPackage.customer.id}}
                </router-link>
              </dd>
            </template>

            <template v-if="fulfillmentPackage.order">
              <dt>Order</dt>
              <dd>
                <router-link :to="{ name: 'ShowOrder', params: { id: fulfillmentPackage.order.id }}">
                 {{fulfillmentPackage.order.id}}
                </router-link>
              </dd>
            </template>
          </dl>
        </div>
      </div>
    </div>

    <div class="foot text-right">
      <el-button @click="attemptDeleteFulfillmentPackage()" plain size="small">Delete</el-button>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isConfirmingDeleteFulfillmentPackage" title="Delete fulfillment package" width="500px">
      <p>
        Are you sure you want to delete this fulfillment package? If you delete
        this fulfillment package, all of the following related resources if any
        will also be deleted:

        <ul>
          <li>All fulfillment item in this fulfillment package</li>
          <li>All file collections that are owned by this fulfillment package and all files inside those collection</li>
        </ul>

        <b>This action cannot be undone.</b>
      </p>

      <div slot="footer">
        <el-button :disabled="isDeletingFulfillmentPackage" @click="cancelDeleteFulfillmentPackage()" plain size="small">Cancel</el-button>
        <el-button :loading="isDeletingFulfillmentPackage" @click="deleteFulfillmentPackage()" type="danger" size="small">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import ConfirmButton from '@/components/confirm-button'
import FulfillmentPackage from '@/models/fulfillment-package'
import FileCollectionBlock from '@/components/file-collection-block'

import resourcePageMixinFactory from '@/mixins/resource-page'
let ResourcePageMixin = resourcePageMixinFactory({ loadMethodName: 'loadFulfillmentPackage' })

export default {
  name: 'ShowFulfillmentPackage',
  mixins: [ResourcePageMixin],
  components: {
    FileCollectionBlock,
    ConfirmButton
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fulfillmentPackage: FulfillmentPackage.objectWithDefaults(),
      isLoading: false,

      isConfirmingDeleteFulfillmentPackage: false,
      isDeletingFulfillmentPackage: false
    }
  },
  computed: {
    avatarUrl () {
      if (this.fulfillmentPackage.avatar) {
        return this.fulfillmentPackage.avatar.url
      }

      return 'https://placehold.it/80x80'
    },

    fileCollections () {
      if (!this.fulfillmentPackage.fileCollections) { return [] }

      return this.fulfillmentPackage.fileCollections
    },

    items () {
      if (!this.fulfillmentPackage.items) { return [] }

      return this.fulfillmentPackage.items
    }
  },
  methods: {
    loadFulfillmentPackage () {
      this.isLoading = true

      return freshcom.retrieveFulfillmentPackage(this.id, {
        include: 'items,fileCollections'
      }).then(response => {
        this.fulfillmentPackage = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    attemptDeleteFulfillmentPackage () {
      this.isConfirmingDeleteFulfillmentPackage = true
    },

    cancelDeleteFulfillmentPackage () {
      this.isConfirmingDeleteFulfillmentPackage = false
    },

    deleteFulfillmentPackage () {
      this.isDeletingFulfillmentPackage = true

      freshcom.deleteFulfillmentPackage(this.fulfillmentPackage.id).then(() => {
        this.isDeletingFulfillmentPackage = false
        this.$message({
          showClose: true,
          message: `Fulfillment package deleted successfully.`,
          type: 'success'
        })

        this.back()
      }).catch(() => {
        this.isDeletingFulfillmentPackage = false
      })
    },

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListFulfillmentPackage' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
