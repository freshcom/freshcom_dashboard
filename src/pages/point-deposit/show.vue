<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/point_deposits" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListPointDeposit' }" index="/point_deposits">Point Deposits</el-menu-item>
    </el-menu>
    <locale-selector @change="loadPointDeposit()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief">
          <div class="avatar">
            <img :src="avatarUrl">
          </div>

          <div class="detail">
            <p>Point Deposit {{pointDeposit.code}}</p>
            <h2>{{pointDeposit.firstName}} {{pointDeposit.lastName}}</h2>
            <p class="id">{{pointDeposit.id}}</p>
          </div>
        </div>

        <div class="header-actions">
          <el-button v-if="pointDeposit.status === 'registered'" @click="editPointDeposit()" plain size="small">Reset Password</el-button>
          <el-button @click="editPointDeposit()" plain size="small">Edit</el-button>
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
              <dd>{{pointDeposit.id}}</dd>

              <dt>Code</dt>
              <dd>{{pointDeposit.code}}</dd>

              <dt>Status</dt>
              <dd>{{pointDeposit.status}}</dd>

              <dt>Name</dt>
              <dd>{{pointDeposit.name}}</dd>

              <dt>Print Name</dt>
              <dd>{{pointDeposit.printName}}</dd>

              <dt>Amount</dt>
              <dd>{{pointDeposit.amount}}</dd>

              <dt>Caption</dt>
              <dd>{{pointDeposit.caption}}</dd>

              <dt>Description</dt>
              <dd>{{pointDeposit.description}}</dd>
            </dl>
          </div>
        </div>

        <div class="block-title">
          <h3>File Collections</h3>

          <span class="block-title-actions pull-right">
            <router-link :to="{ name: 'NewExternalFileCollection', query: { pointDepositId: pointDeposit.id, callbackPath: currentRoutePath } }">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </router-link>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="pointDeposit.externalFileCollections" stripe class="block-table" :show-header="false" style="width: 100%">
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
            {{pointDeposit.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt v-if="pointDeposit.enroller">Enroller</dt>
              <dd v-if="pointDeposit.enroller">
                <a href="#">{{pointDeposit.enroller.id}}</a>
              </dd>

              <dt v-if="pointDeposit.sponsor">Sponsor</dt>
              <dd v-if="pointDeposit.sponsor">
                <a href="#">{{pointDeposit.sponsor.id}}</a>
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
        <delete-button @confirmed="deletePointDeposit()" plain size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

import PointDeposit from '@/models/point-deposit'
import DeleteButton from '@/components/delete-button'
import { dollar, idLastPart } from '@/helpers/filters'

export default {
  name: 'ShowPointDeposit',
  props: ['id'],
  components: {
    DeleteButton
  },
  filters: {
    dollar,
    idLastPart
  },
  data () {
    return {
      pointDeposit: PointDeposit.objectWithDefaults(),
      isLoading: false,

      errors: {}
    }
  },
  created () {
    this.loadPointDeposit()
  },
  computed: {
    avatarUrl () {
      if (this.pointDeposit.avatar) {
        return this.pointDeposit.avatar.url
      }

      return 'http://placehold.it/80x80'
    },
    currentRoutePath () {
      return this.$store.state.route.fullPath
    }
  },
  methods: {
    loadPointDeposit () {
      this.isLoading = true
      this.$store.dispatch('pointDeposit/getPointDeposit', {
        id: this.id
      }).then(pointDeposit => {
        this.pointDeposit = pointDeposit

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
        throw errors
      })
    },

    editPointDeposit () {
      this.$store.dispatch('pushRoute', { name: 'EditPointDeposit', params: { id: this.pointDeposit.id } })
    },

    deletePointDeposit () {
      this.$store.dispatch('pointDeposit/deletePointDeposit', this.pointDeposit.id).then(() => {
        this.$message({
          showClose: true,
          message: `Point deposit deleted successfully.`,
          type: 'success'
        })

        this.back()
      })
    },

    back () {
      this.$store.dispatch('pushRoute', { name: 'ListPointDeposit' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
