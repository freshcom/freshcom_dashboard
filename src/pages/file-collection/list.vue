<template>
<content-container @locale-changed="listFileCollection">
  <div slot="header">
    <router-link :to="{ name: 'ListFileCollection' }">File Collections</router-link>
    <router-link :to="{ name: 'ListFile' }">Files</router-link>
  </div>

  <div slot="card-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="active">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['active', 'draft']" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="label" default="">
            <span slot="key">Label</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.label" type="text"></input>
              </div>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="ownerType" default="">
            <span slot="key">Owner Type</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.ownerType" type="text"></input>
              </div>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="ownerId" default="">
            <span slot="key">Owner ID</span>
            <div slot="value">
              <select value="$eq">
                <option value="$eq">is equal to</option>
              </select>

              <div class="m-t-5">
                <icon name="share" class="fa-flip-vertical" scale="0.8"></icon>
                <input v-model="filterObjectDraft.ownerId" type="text"></input>
              </div>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewFileCollection' }" class="el-button el-button--small is-plain">
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
          <p><icon name="folder" scale="3"></icon></p>
          <p>
            <span>You haven't created any file collection yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewFileCollection' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first file collection</span>
            </span>
          </router-link>
        </div>

        <el-table :data="fileCollections" slot="content" class="data-table">
          <el-table-column prop="name" label="FILE COLLECTION">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span v-if="scope.row.code">
                  [{{scope.row.code}}]
                </span>

                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                <el-tag v-if="scope.row.status == 'active'" :disable-transitions="true" size="mini">
                  {{$t(`fields.fileCollection.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" size="mini">
                  {{$t(`fields.fileCollection.status.${scope.row.status}`)}}
                </el-tag>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.id | idLastPart }}
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column prop="updatedAt" label="UPDATED" align="right" width="200">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowFileCollection', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
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
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listFileCollection' })

export default {
  name: 'ListFileCollection',
  mixins: [ListPageMixin],
  data () {
    return {
      fileCollections: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0,

      errors: {}
    }
  },
  created () {
    this.listFileCollection()
  },
  methods: {
    listFileCollection () {
      this.isLoading = true

      freshcom.listFileCollection({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.fileCollections = response.data
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
<style scoped>
</style>
