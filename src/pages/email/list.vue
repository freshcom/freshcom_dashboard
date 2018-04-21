<template>
<content-container @locale-changed="listEmail">
  <div slot="header">
    <router-link :to="{ name: 'ListEmail' }">Emails</router-link>
    <router-link :to="{ name: 'ListEmailTemplate' }">Templates</router-link>
  </div>

  <div slot="card-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="sent">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['sent', 'pending']" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="to" default="">
            <span slot="key">Destinatoin Email</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.to" type="text"></input>
              </div>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="from" default="">
              <span slot="key">Sender Email</span>
              <div slot="value">
                <select value="$eq">
                  <option value="$eq">is equal to</option>
                </select>

                <div style="vertical-align: middle;" class="m-t-5">
                  <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                  <input v-model="filterObjectDraft.from" type="text"></input>
                </div>
              </div>
            </filter-condition>
          </filter-button>
        </filter-button>
        <search-input :value="searchKeyword"></search-input>
      </el-col>
    </el-row>
  </div>

  <div slot="card-content">
    <div class="data full">
      <query-result :is-loading="isLoading" :total-count="totalCount" :all-count="allCount" :page="page">
        <div slot="no-content">
          <p><icon name="envelope" scale="3"></icon></p>
          <p>
            <span>You haven't created any email yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>
        </div>

        <el-table :data="emails" slot="content" class="data-table">
          <el-table-column prop="name" label="EMAIL">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowEmail', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span>{{scope.row.subject}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowEmail', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                <el-tag v-if="scope.row.status == 'active'" :disable-transitions="true" size="mini">
                  {{$t(`fields.email.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.email.status.${scope.row.status}`)}}
                </el-tag>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="id" label="TO" width="220">
            <template slot-scope="scope">
              {{scope.row.to}}
            </template>
          </el-table-column>

          <el-table-column prop="updatedAt" label="UPDATED" align="right" width="200">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowEmail', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
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
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listEmail' })

export default {
  name: 'ListEmail',
  mixins: [ListPageMixin],
  data () {
    return {
      emails: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listEmail()
  },
  methods: {
    listEmail () {
      this.isLoading = true

      return freshcom.listEmail({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.emails = response.data
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
