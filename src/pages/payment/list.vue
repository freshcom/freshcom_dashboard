<template>
<content-container @locale-changed="listPayment">
  <div slot="header">
    <router-link :to="{ name: 'ListPayment' }">Payments</router-link>
    <router-link :to="{ name: 'ShowBalanceSettings' }">Settings</router-link>
  </div>

  <div slot="card-header">
    <el-row>
      <el-col :span="16">
        <filter-button :current="filterObject" :draft="filterObjectDraft" @cancel="resetFilter" @clear="clearFilter">
          <filter-condition v-model="filterObjectDraft" filter-key="status" default="pending">
            <span slot="key">Status</span>
            <div slot="value">
              <select v-model="filterObjectDraft.status">
                <option v-for="status in ['pending', 'paid', 'refunded']" :value="status">is {{status}}</option>
              </select>
            </div>
          </filter-condition>
        </filter-button>

        <search-input :value="searchKeyword"></search-input>
      </el-col>
    </el-row>
  </div>

  <div slot="card-content">
    <div class="data full">
      <query-result :is-loading="isLoading" :total-count="totalCount" :all-count="allCount" :page="page">
        <div slot="no-content">
          <p><icon name="money" scale="3"></icon></p>
          <p>
            <span>You haven't created any payment yet.</span>
            <a href="javascript:;">Learn more &rarr;</a>
          </p>
        </div>

        <el-table :data="payments" slot="content" class="data-table">
          <el-table-column label="PAYMENT">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }" class="primary">
                <b>{{scope.row.amountCents | dollar}}</b>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="STATUS" width="160">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                <el-tag v-if="scope.row.status == 'active'" :disable-transitions="true" size="mini">
                  {{$t(`fields.payment.status.${scope.row.status}`)}}
                </el-tag>
                <el-tag v-else :disable-transitions="true" type="info" size="mini">
                  {{$t(`fields.payment.status.${scope.row.status}`)}}
                </el-tag>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column label="GATEWAY">
            <template slot-scope="scope">
              <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                {{$t(`fields.payment.gateway.${scope.row.gateway}`)}}
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
              <router-link :to="{ name: 'ShowPayment', params: { id: scope.row.id } }">
                {{scope.row.updatedAt | moment}}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </query-result>
    </div>
  </div>
</content-container>

<!-- <div class="page-wrapper">

  <div>
    <el-menu :router="true" default-active="/payments" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">Payments</el-menu-item>
    </el-menu>
    <locale-selector @change="listPayment()" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card class="main-card">
      <div slot="header">
        <div v-if="isViewingTestData" class="test-data-banner">
          <div class="banner-content">TEST DATA</div>
        </div>

        <el-button size="small"><icon name="filter" scale="0.7" class="v-middle"></icon> Filter</el-button>

        <div class="search">
          <el-input :value="searchKeyword" @input="updateSearchKeyword" size="small" placeholder="Search...">
            <template slot="prepend"><icon name="search" scale="1" class="v-middle"></icon></template>
          </el-input>
        </div>
      </div>

      <div class="data full" v-loading="isLoading">
        <p v-if="noSearchResult" class="search-notice text-center">
          There is no result that matches "{{searchKeyword}}"
        </p>
        <el-table v-if="hasSearchResult" @row-click="viewPayment" :data="payments">
          <el-table-column prop="amountCents" label="Payment">
            <template slot-scope="scope">
              <b>{{scope.row.amountCents | dollar}}</b>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" width="200">
            <template slot-scope="scope">
              {{$t(`fields.payment.status.${scope.row.status}`)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Gateway" width="100">
            <template slot-scope="scope">
              {{$t(`fields.payment.gateway.${scope.row.gateway}`)}}
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="120">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <span>{{ scope.row.id }}</span>
                <div slot="reference" class="name-wrapper">
                  {{scope.row.id | idLastPart}}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="insertedAt" label="" align="right" width="200">
            <template slot-scope="scope">
              {{scope.row.insertedAt | moment}}
            </template>
          </el-table-column>
        </el-table>

        <div v-if="hasSearchResult" class="footer">
          <span class="total">around {{totalCount}} results</span>
          <pagination :number="page.number" :size="page.size" :total="totalCount"></pagination>
        </div>
      </div>
    </el-card>
  </div>

</div> -->
</template>

<script>
import freshcom from '@/freshcom-sdk'

import { dollar } from '@/helpers/filters'

import listPageMixinFactory from '@/mixins/list-page'
let ListPageMixin = listPageMixinFactory({ listMethodName: 'listPayment' })

export default {
  name: 'ListPayment',
  mixins: [ListPageMixin],
  filters: {
    dollar
  },
  data () {
    return {
      payments: [],
      isLoading: false,
      allCount: 0,
      totalCount: 0
    }
  },
  created () {
    this.listPayment()
  },
  methods: {
    listPayment () {
      this.isLoading = true

      freshcom.listPayment({
        search: this.searchKeyword,
        page: this.page
      }).then(response => {
        this.payments = response.data
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
