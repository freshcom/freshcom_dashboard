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
              <select v-model="filterObjectDraft.role">
                <option value="">Please select a role</option>
                <option v-for="role in roles" :key="role" :value="role">is {{$t(`fields.accountMembership.role.${role}`)}}</option>
              </select>
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
              <router-link v-if="scope.row.userKind === 'managed'" :to="{ name: 'ShowUser', params: { id: scope.row.user.id } }" class="primary">
                <span>{{scope.row.userName}} (<span>{{scope.row.userUsername}}</span>)</span>
              </router-link>
              <span v-else>
                {{scope.row.userName}} (<span>{{scope.row.userUsername}}</span>)
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="ROLE" width="150">
            <template slot-scope="scope">
              <span v-if="currentUser.id === scope.row.user.id">
                {{$t(`fields.accountMembership.role.${scope.row.role}`)}}
              </span>
              <a v-else @click="changeRole(scope.row)" href="javascript:;">
                <span>{{$t(`fields.accountMembership.role.${scope.row.role}`)}}</span>
              </a>
            </template>
          </el-table-column>

          <el-table-column prop="updatedAt" label="UPDATED" align="right" width="200">
            <template slot-scope="scope">
              {{scope.row.updatedAt | moment}}
            </template>
          </el-table-column>
        </el-table>
      </query-result>
    </div>
  </div>

  <div slot="launchable" class="launchable">
    <el-dialog :show-close="false" :visible="isChangingRole" title="Change Role" width="300px">

      <el-form>
        <el-form @submit.native.prevent="updateRole()" label-width="50px" size="small">
          <el-form-item label="Role" required>
            <el-select v-model="membershipDraft.role">
              <el-option label="Read Only" value="readOnly"></el-option>
              <el-option label="Support Specialist" value="supportSpecialist"></el-option>
              <el-option label="Goods Specialist" value="goodsSpecialist"></el-option>
              <el-option label="Marketing Specialist" value="marketingSpecialist"></el-option>
              <el-option label="Manager" value="manager"></el-option>
              <el-option label="Developer" value="developer"></el-option>
              <el-option label="Administrator" value="administrator"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdatingRole" @click="closeChangeRoleDialog()" plain size="small">Cancel</el-button>
        <el-button :loading="isUpdatingRole" @click="updateRole()" type="primary" size="small">Save</el-button>
      </div>
    </el-dialog>
  </div>
</content-container>
</template>

<script>
import { ROLES } from '@/env'
import freshcom from '@/freshcom-sdk'
import withLiveMode from '@/helpers/with-live-mode'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listAccountMembership' })

export default {
  name: 'ListUser',
  mixins: [ListPageMixin],
  data () {
    return {
      roles: ROLES,
      memberships: [],
      targetMembership: {},
      membershipDraft: {},
      isChangingRole: false,
      isUpdatingRole: false,

      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listAccountMembership()
  },
  computed: {
    currentUser () {
      return this.$store.state.session.user
    }
  },
  methods: {
    listAccountMembership () {
      this.isLoading = true

      return withLiveMode(() => {
        return freshcom.listAccountMembership({
          search: this.searchKeyword,
          filter: this.filterObject,
          page: this.page,
          include: 'user'
        }).then(response => {
          this.memberships = response.data
          this.allCount = response.meta.allCount
          this.totalCount = response.meta.totalCount

          this.isLoading = false
        }).catch(errors => {
          this.isLoading = false
        })
      })
    },

    changeRole (membership) {
      this.isChangingRole = true
      this.targetMembership = membership
      this.membershipDraft = {
        id: membership.id,
        type: 'AccountMembership',
        role: membership.role
      }
    },

    closeChangeRoleDialog () {
      this.isChangingRole = false
    },

    updateRole () {
      this.isUpdatingRole = true

      withLiveMode(() => {
        return freshcom.updateAccountMembership(this.membershipDraft.id, this.membershipDraft).then(response => {
          this.targetMembership.role = response.data.role
          this.$message({
            showClose: true,
            message: `Role changed successfully.`,
            type: 'success'
          })

          this.isUpdatingRole = false
          this.closeChangeRoleDialog()
        }).catch(errors => {
          this.isUpdatingRole = false
          throw errors
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
