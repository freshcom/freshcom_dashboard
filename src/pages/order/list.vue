<template>
<content-container @locale-changed="listOrder">
  <div slot="header">
    <router-link :to="{ name: 'ListOrder'}">Orders</router-link>
  </div>

  <div slot="card-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="opened">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['opened', 'closed']" :key="status" :value="status">is {{status}}</option>
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

          <filter-condition v-model="filterObjectDraft" filter-key="paymentStatus" default="pending">
            <span slot="key">Payment Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.paymentStatus">
                <option v-for="status in ['pending', 'authorized', 'paid', 'refunded']" :key="status" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>

          <filter-condition v-model="filterObjectDraft" filter-key="fulfillmentStatus" default="pending">
            <span slot="key">Fulfillment Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.fulfillmentStatus">
                <option v-for="status in ['pending', 'fulfilled', 'returned']" :key="status" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>

      <el-col :span="8">
        <div class="text-right">
          <el-button-group>
            <router-link :to="{ name: 'NewOrder' }" class="el-button el-button--small is-plain">
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
          <p><icon name="file-text" scale="3"></icon></p>
          <p>
            <span>You haven't created any order yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>

          <router-link :to="{ name: 'NewOrder' }" class="el-button el-button--small is-plain">
            <span class="with-icon">
              <span class="icon-wrapper">
                <icon name="plus" scale="0.6"></icon>
              </span>
              <span>Create your first order</span>
            </span>
          </router-link>
        </div>

        <el-table :data="orders" slot="content" class="data-table">
          <el-table-column label="ORDER" width="150">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }" class="primary">
                <span v-if="scope.row.code">
                  [{{scope.row.code}}]
                </span>

                <span>{{scope.row.name}}</span>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column width="100">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                {{scope.row.grandTotalCents | dollar}}
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="STATUS">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                <el-tag v-if="scope.row.status === 'opened'" :disable-transitions="true" size="mini">
                  {{$t(`fields.order.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.order.status.${scope.row.status}`)}}
                </el-tag>

                <el-tag v-if="scope.row.paymentStatus === 'pending'" :disable-transitions="true" size="mini" type="warning">
                  Pending Payment
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.order.paymentStatus.${scope.row.paymentStatus}`)}}
                </el-tag>

                <el-tag v-if="scope.row.fulfillmentStatus === 'pending'" :disable-transitions="true" size="mini" type="warning">
                  Pending Fulfillment
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.order.fulfillmentStatus.${scope.row.fulfillmentStatus}`)}}
                </el-tag>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference">
                  {{ scope.row.id | idLastPart }}
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column label="OPENED" align="right" width="180">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowOrder', params: { id: scope.row.id, callbackPath: this.currentRoutePath } }">
                {{scope.row.openedAt | moment}}
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

import { dollar } from '@/helpers/filters'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listOrder' })

export default {
  name: 'ListOrder',
  mixins: [ListPageMixin],
  filters: {
    dollar
  },
  data () {
    return {
      orders: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listOrder()
  },
  methods: {
    listOrder () {
      this.isLoading = true

      freshcom.listOrder({
        search: this.searchKeyword,
        filter: this.filterObject,
        page: this.page
      }).then(response => {
        this.orders = response.data
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
