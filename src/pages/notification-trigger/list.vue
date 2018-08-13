<template>
<content-container @locale-changed="listNotificationTrigger">
  <div slot="header">
    <el-menu :router="true" default-active="/notification-triggers" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListNotificationTrigger' }" index="/notification-triggers">
        Triggers
      </el-menu-item>
    </el-menu>
  </div>

  <div v-if="allCount > 0" slot="content-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="active">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['active', 'draft']" :key="status" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="event" default="">
            <span slot="key">Event</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.event" type="text">
              </div>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="actionType" default="">
            <span slot="key">Action Type</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.actionType" type="text">
              </div>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="actionTarget" default="">
            <span slot="key">Action Target</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.actionTarget" type="text">
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewNotificationTrigger' }" class="el-button el-button--small is-plain">
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
          <p><icon name="external-link" scale="3"></icon></p>
          <p>
            <span>You haven't created any notification trigger yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewNotificationTrigger' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first notification trigger</span>
            </span>
          </router-link>
        </div>

        <el-table :data="notificationTriggers" slot="content">
          <el-table-column prop="name" label="TRIGGER">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowNotificationTrigger', params: { id: scope.row.id } }" class="primary">
                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="name" width="100">
            <template slot-scope="scope">
              {{$t(`fields.notificationTrigger.actionType.${scope.row.actionType}`)}}
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <hover-button v-show="scope.row.status === 'active'" @click="deactivateProduct(scope.row)" type="primary" hover-type="info">
                <span slot="normal">{{$t(`fields.notificationTrigger.status.${scope.row.status}`)}}</span>
                <span slot="hover">Deactive</span>
              </hover-button>

              <hover-button v-show="scope.row.status !== 'active'" @click="activateProduct(scope.row)" type="info" hover-type="primary">
                <span slot="normal">{{$t(`fields.notificationTrigger.status.${scope.row.status}`)}}</span>
                <span slot="hover">Activate</span>
              </hover-button>
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
              <router-link :to="{ name: 'ShowNotificationTrigger', params: { id: scope.row.id } }">
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

import HoverButton from '@/components/hover-button'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listNotificationTrigger' })

export default {
  name: 'ListNotificationTrigger',
  mixins: [ListPageMixin],
  components: {
    HoverButton
  },
  data () {
    return {
      notificationTriggers: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listNotificationTrigger()
  },
  methods: {
    listNotificationTrigger () {
      this.isLoading = true

      return freshcom.listNotificationTrigger({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.notificationTriggers = response.data
        this.allCount = response.meta.allCount
        this.totalCount = response.meta.totalCount

        this.isLoading = false
      }).catch(response => {
        this.isLoading = false
        throw response
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
