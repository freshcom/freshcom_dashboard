<template>
  <content-container @locale-changed="loadUnlockable" :ready="isReady">
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
              <router-link :to="{ name: 'NewFileCollection', query: { ownerId: unlockable.id, ownerType: 'Unlockable', callbackPath: currentRoutePath } }" class="el-button el-button--mini is-plain">
                Add
              </router-link>
            </div>
          </div>

          <div class="body full">
            <el-table :data="fileCollections" class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="300">
                <template slot-scope="scope">
                  <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id } }">
                    <span>{{scope.row.name}}</span>
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
                  <p class="action-group">
                    <el-button-group>
                      <router-link :to="{ name: 'EditFileCollection', params: { id: scope.row.id }}" class="el-button el-button--mini is-plain">
                        Edit
                      </router-link>
                      <confirm-button plain size="mini">Delete</confirm-button>
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
        <confirm-button @confirmed="deleteUnlockable()" plain size="small">Delete</confirm-button>
      </div>
    </div>
  </content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import ContentContainer from '@/components/content-container'
import PageMixin from '@/mixins/page'
import Unlockable from '@/models/unlockable'
import ConfirmButton from '@/components/confirm-button'

export default {
  name: 'ShowUnlockable',
  mixins: [PageMixin],
  components: {
    ContentContainer,
    ConfirmButton
  },
  props: ['id'],
  data () {
    return {
      unlockable: Unlockable.objectWithDefaults(),
      isReady: false,
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

      freshcom.retrieveUnlockable(this.id, {
        include: 'avatar,fileCollections'
      }).then(response => {
        this.unlockable = response.data
        this.isLoading = false
        this.isReady = true
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
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

    defaultBack () {
      this.$store.dispatch('pushRoute', { name: 'ListUnlockable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
