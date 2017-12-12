<template>
<div class="main-col">
  <div>
    <el-menu :router="true" default-active="/unlockables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListUnlockable' }" index="/unlockables">Unlockables</el-menu-item>
    </el-menu>
    <locale-selector @change="loadUnlockable()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief">
          <div class="avatar">
            <img :src="avatarUrl">
          </div>

          <div class="detail">
            <p>Unlockable {{unlockable.code}}</p>
            <h2>{{unlockable.name}}</h2>
            <p class="id">{{unlockable.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button @click="editUnlockable()" plain size="small">Edit</el-button>
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

        <div class="block-title">
          <h3>File Collections</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewExternalFileCollection', query: { ownerId: unlockable.id, ownerType: 'Unlockable', callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="unlockable.externalFileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
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
            {{unlockable.customData}}
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
        <delete-button @confirmed="deleteUnlockable()" plain size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/plus'
import freshcom from '@/freshcom-sdk'

import Unlockable from '@/models/unlockable'
import DeleteButton from '@/components/delete-button'
import { idLastPart } from '@/helpers/filters'

export default {
  name: 'ShowUnlockable',
  props: ['id'],
  components: {
    DeleteButton
  },
  filters: {
    idLastPart
  },
  data () {
    return {
      unlockable: Unlockable.objectWithDefaults(),
      isLoading: false
    }
  },
  created () {
    this.loadUnlockable()
  },
  computed: {
    avatarUrl () {
      if (this.unlockable.avatar) {
        return this.unlockable.avatar.url
      }

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadUnlockable () {
      this.isLoading = true

      freshcom.retrieveUnlockable(this.id, {
        include: 'avatar,externalFileCollections'
      }).then(response => {
        this.unlockable = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    editUnlockable () {
      this.$store.dispatch('pushRoute', { name: 'EditUnlockable', params: { id: this.unlockable.id } })
    },

    deleteUnlockable () {
      freshcom.deleteUnlockable(this.unlockable.id).then(() => {
        this.$message({
          showClose: true,
          message: `Unlockable deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListUnlockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
