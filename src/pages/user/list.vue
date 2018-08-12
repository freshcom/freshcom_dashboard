<template>
<content-container :disable-test-banner="true">
  <div slot="header">
    <el-menu :router="true" default-active="/users" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListUser' }" index="/users">
        Team
      </el-menu-item>
    </el-menu>
  </div>

  <div slot="content-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="role" default="">
            <span slot="key">Role</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.role" type="text">
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewUser' }" class="el-button el-button--small is-plain">
              <span class="with-icon">
                <span class="icon-wrapper">
                  <icon name="plus" scale="0.6"></icon>
                </span>
                <span>New</span>
              </span>
            </router-link>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
  </div>

  <div slot="content-body">
    <div class="data full">
      <query-result :is-loading="isLoading" :total-count="totalCount" :all-count="allCount" :page="page">
        <el-table :data="memberships" slot="content">
          <el-table-column prop="name" label="USER">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowUser', params: { id: scope.row.id } }" class="primary">
                <span>{{scope.row.userName}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="email" label="USERNAME">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowUser', params: { id: scope.row.id } }" class="primary">
                <span>{{scope.row.userUsername}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="ROLE" width="120">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowUser', params: { id: scope.row.id } }">
                <span>{{scope.row.role}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="updatedAt" label="UPDATED" align="right" width="200">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowStockable', params: { id: scope.row.id } }">
                {{scope.row.updatedAt | moment}}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </query-result>
    </div>
  </div>
</content-container>
</template>

<script>
import freshcom from '@/freshcom-sdk'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listAccountMembership' })

export default {
  name: 'ListUser',
  mixins: [ListPageMixin],
  data () {
    return {
      memberships: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listAccountMembership()
  },
  methods: {
    listAccountMembership () {
      this.isLoading = true

      let currentAccessToken = this.$store.state.session.token.access_token
      let liveAccessToken = this.$store.state.session.liveToken.access_token

      freshcom.setAccessToken(liveAccessToken)
      return freshcom.listAccountMembership({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.memberships = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
        freshcom.setAccessToken(currentAccessToken)
      }).catch(errors => {
        this.isLoading = false
        freshcom.setAccessToken(currentAccessToken)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
