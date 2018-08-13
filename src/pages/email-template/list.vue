<template>
<content-container @locale-changed="listEmailTemplate">
  <div slot="header">
    <el-menu :router="true" default-active="/email-templates" mode="horizontal" class="header-menu">
      <el-menu-item :route="{ name: 'ListEmail' }" index="/emails">
        Emails
      </el-menu-item>
      <el-menu-item :route="{ name: 'ListEmailTemplate' }" index="/email-templates">
        Templates
      </el-menu-item>
    </el-menu>
  </div>

  <div v-if="allCount > 0" slot="content-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="from" default="">
            <span slot="key">Sender Email</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div style="vertical-align: middle;" class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.from" type="text">
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewEmailTemplate' }" class="el-button el-button--small is-plain">
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
          <p><icon name="file-code-o" scale="3"></icon></p>
          <p>
            <span>You haven't created any email template yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewEmailTemplate' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first email template</span>
            </span>
          </router-link>
        </div>

        <el-table :data="emailTemplates" slot="content">
          <el-table-column prop="name" label="EMAIL TEMPLATE">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowEmailTemplate', params: { id: scope.row.id } }" class="primary">
                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="to" label="TO" width="200">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowEmailTemplate', params: { id: scope.row.id } }">
                {{scope.row.to}}
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
              <router-link :to="{ name: 'ShowEmailTemplate', params: { id: scope.row.id } }">
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
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listEmailTemplate' })

export default {
  name: 'ListEmail',
  mixins: [ListPageMixin],
  data () {
    return {
      emailTemplates: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listEmailTemplate()
  },
  methods: {
    listEmailTemplate () {
      this.isLoading = true

      return freshcom.listEmailTemplate({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.emailTemplates = response.data
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
