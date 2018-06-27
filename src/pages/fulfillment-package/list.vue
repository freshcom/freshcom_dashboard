<template>
<content-container @locale-changed="listFulfillmentPackage">
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
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="pending">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['pending', 'fulfilled']" :key="status" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="label" default="">
            <span slot="key">Label</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.label" type="text">
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewFulfillmentPackage' }" class="el-button el-button--small is-plain">
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
        <div slot="no-content">
          <p><icon name="shopping-bag" scale="3"></icon></p>
          <p>
            <span>You haven't created any fulfillment package yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewFulfillmentPackage' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first fulfillment package</span>
            </span>
          </router-link>
        </div>

        <el-table :data="fulfillmentPackages" slot="content">
          <el-table-column prop="name" label="FULFILLMENT PACKAGE">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowFulfillmentPackage', params: { id: scope.row.id } }" class="primary">
                <span v-if="scope.row.code">
                  [{{scope.row.code}}]
                </span>

                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowFulfillmentPackage', params: { id: scope.row.id } }">
                <el-tag v-if="scope.row.status == 'active'" :disable-transitions="true" size="mini">
                  {{$t(`fields.fulfillmentPackage.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.fulfillmentPackage.status.${scope.row.status}`)}}
                </el-tag>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference">
                  {{ scope.row.id | idLastPart }}
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column prop="updatedAt" label="UPDATED" align="right" width="200">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowFulfillmentPackage', params: { id: scope.row.id } }">
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
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listFulfillmentPackage' })

export default {
  name: 'listFulfillmentPackage',
  mixins: [ListPageMixin],
  data () {
    return {
      fulfillmentPackages: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0,

      errors: {}
    }
  },
  created () {
    this.listFulfillmentPackage()
  },
  methods: {
    listFulfillmentPackage () {
      this.isLoading = true

      freshcom.listFulfillmentPackage({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.fulfillmentPackages = response.data
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
