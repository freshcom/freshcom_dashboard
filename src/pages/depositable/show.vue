<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/depositables" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListDepositable' }" index="/depositables">Depositables</el-menu-item>
    </el-menu>
    <locale-selector @change="loadDepositable()" class="pull-right"></locale-selector>
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
            <p>Depositable {{depositable.code}}</p>
            <h2>{{depositable.firstName}} {{depositable.lastName}}</h2>
            <p class="id">{{depositable.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button v-if="depositable.status === 'registered'" @click="editDepositable()" plain size="small">Reset Password</el-button>
          <el-button @click="editDepositable()" plain size="small">Edit</el-button>
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
              <dd>{{depositable.id}}</dd>

              <dt>Code</dt>
              <dd>{{depositable.code}}</dd>

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

        <div class="block-title">
          <h3>File Collections</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewExternalFileCollection', query: { ownerId: depositable.id, ownerType: 'Depositable', callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="depositable.externalFileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
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
            {{depositable.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="depositable.enroller">Enroller</dt>
              <dd v-if="depositable.enroller">
                <a href="#">{{depositable.enroller.id}}</a>
              </dd>

              <dt v-if="depositable.sponsor">Sponsor</dt>
              <dd v-if="depositable.sponsor">
                <a href="#">{{depositable.sponsor.id}}</a>
              </dd>
            </dl>
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
        <delete-button @confirmed="deleteDepositable()" plain size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/plus'
import freshcom from '@/freshcom-sdk'

import PageMixin from '@/mixins/page'
import Depositable from '@/models/depositable'
import DeleteButton from '@/components/delete-button'
import { idLastPart } from '@/helpers/filters'

export default {
  name: 'ShowDepositable',
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
      depositable: Depositable.objectWithDefaults(),
      isLoading: false
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

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadDepositable () {
      this.isLoading = true

      freshcom.retrieveDepositable(this.id, {
        include: 'avatar,externalFileCollections'
      }).then(response => {
        this.depositable = response.data
        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    editDepositable () {
      this.$store.dispatch('pushRoute', { name: 'EditDepositable', params: { id: this.depositable.id } })
    },

    deleteDepositable () {
      freshcom.deleteDepositable(this.depositable.id).then(() => {
        this.$message({
          showClose: true,
          message: `Depositable deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListDepositable' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
