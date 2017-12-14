<template>
<div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/stockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListStockable' }" index="/stockables">Stockables</el-menu-item>
    </el-menu>
    <locale-selector @change="loadStockable()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <div class="brief">
          <div class="avatar">
            <img :src="avatarUrl">
          </div>

          <div class="detail">
            <p>{{stockable.code}}</p>
            <h2>{{stockable.name}}</h2>
            <p class="id">{{stockable.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editStockable()" plain size="small">Edit</el-button>
        </div>
      </div>

      <div class="data">
        <div class="block-title">
          <h3>Details</h3>
        </div>
        <div class="block">
          <div class="block-body">
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

        <div class="block-title">
          <h3>File Collections</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewExternalFileCollection', query: { stockableId: stockable.id, callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="stockable.externalFileCollections" stripe class="block-table" :show-header="false">
              <el-table-column width="500">
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowExternalFileCollection', params: { id: scope.row.id } }">
                    <span>{{scope.row.name}}</span>
                    <span v-if="scope.row.name"> - </span>
                    <span>{{scope.row.label}}</span>
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.fileCount}} files</span>
                </template>
              </el-table-column>

              <el-table-column>
                <template slot-scope="scope">
                  <p class="text-right actions">
                    <router-link :to="{ name: 'EditExternalFileCollection', params: { id: scope.row.id }}">
                      <icon name="pencil" scale="0.8" class="v-middle"></icon>
                      <span class="v-middle">Edit</span>
                    </router-link>
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="block-footer text-center">
            <a class="view-more" href="#">View More</a>
          </div>
        </div>


        <div class="block-title">
          <h3>Custom Data</h3>
        </div>
        <div class="block">
          <div class="block-body">
            {{stockable.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Logs</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Events</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>
      </div>

      <div class="footer text-right">
        <delete-button @confirmed="deleteStockable()" size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>

</div>
</template>

<script>
import 'vue-awesome/icons/plus'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Stockable from '@/models/stockable'
import DeleteButton from '@/components/delete-button'
import { idLastPart } from '@/helpers/filters'

export default {
  name: 'ShowStockable',
  mixins: [PageMixin],
  components: {
    DeleteButton
  },
  filters: {
    idLastPart
  },
  props: ['id'],
  data () {
    return {
      stockable: Stockable.objectWithDefaults(),
      isLoading: false
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

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadStockable () {
      this.isLoading = true

      freshcom.retrieveStockable(this.id, {
        include: 'avatar,externalFileCollections'
      }).then(response => {
        this.stockable = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    editStockable () {
      this.$store.dispatch('pushRoute', { name: 'EditStockable', params: { id: this.stockable.id } })
    },

    deleteStockable () {
      freshcom.deleteStockable(this.stockable.id).then(() => {
        this.$message({
          showClose: true,
          message: `Stockable deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListStockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
