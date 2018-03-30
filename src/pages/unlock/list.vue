<template>
<content-container @locale-changed="listUnlock">
  <div slot="header">
    <router-link :to="{ name: 'ListUnlock' }">Unlocks</router-link>
  </div>

  <div slot="card-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="customerId" default="">
            <span slot="key">Customer ID</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.customerId" type="text"></input>
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewUnlockable' }" class="el-button el-button--small is-plain">
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

  <div slot="card-content">
    <div class="data full">
      <query-result :is-loading="isLoading" :total-count="totalCount" :all-count="allCount" :page="page">
        <div slot="no-content">
          <p><icon name="unlock" scale="3"></icon></p>
          <p>
            <span>You haven't created any unlock yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewUnlock' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first unlock</span>
            </span>
          </router-link>
        </div>

        <el-table :data="unlocks" slot="content" class="data-table">
          <el-table-column label="UNLOCKABLE" width="300">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowUnlockable', params: { id: scope.row.unlockable.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span v-if="scope.row.unlockable.code">
                  [{{scope.row.unlockable.code}}]
                </span>

                <span>{{scope.row.unlockable.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="CUSTOMER" width="300">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowCustomer', params: { id: scope.row.customer.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span v-if="scope.row.customer.code">
                  [{{scope.row.customer.code}}]
                </span>

                <span>{{scope.row.customer.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="CREATED" align="right">
            <template slot-scope="scope">
              {{scope.row.insertedAt | moment}}
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
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listUnlock' })

export default {
  name: 'ListUnlock',
  mixins: [ListPageMixin],
  data () {
    return {
      unlocks: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0,

      errors: {}
    }
  },
  created () {
    this.listUnlock()
  },
  methods: {
    listUnlock () {
      this.isLoading = true

      freshcom.listUnlock({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page,
        include: 'unlockable,customer'
      }).then(response => {
        this.unlocks = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
      }).catch(errors => {
        this.isLoading = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
