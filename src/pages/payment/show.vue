<template>
<div class="page-wrapper">
  <div>
    <el-menu :router="true" default-active="/payments" mode="horizontal" class="secondary-nav">
      <el-menu-item :route="{ name: 'ListOrder' }" index="/orders">Orders</el-menu-item>
      <el-menu-item :route="{ name: 'ListPayment' }" index="/payments">Payments</el-menu-item>
    </el-menu>
    <locale-selector @change="loadRecord" class="pull-right"></locale-selector>
  </div>

  <div>
    <el-card v-loading="isLoading" class="main-card">
      <div slot="header">

        <div class="brief no-avatar">
          <div class="detail">
            <p>Payment {{record.code}}</p>
            <h2>{{briefAmountCents | dollar}}</h2>
            <p class="id">{{record.id}}</p>
          </div>
        </div>
      </div>

      <div class="data">
        <div class="block-title">
          <h3>Details</h3>
        </div>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt>ID</dt>
              <dd>{{record.id}}</dd>

              <dt v-if="record.code">Code</dt>
              <dd v-if="record.code">{{record.code}}</dd>

              <dt>Status</dt>
              <dd>
                {{$t(`attributes.payment.status.${record.status}`)}}
              </dd>

              <dt v-if="record.gateway">Gateway</dt>
              <dd v-if="record.gateway">{{record.gateway}}</dd>

              <dt v-if="record.processor">Processor</dt>
              <dd v-if="record.processor">{{record.processor}}</dd>

              <dt v-if="record.method">Method</dt>
              <dd v-if="record.method">{{record.method}}</dd>

              <dt v-if="record.authorizedAmountCents">Authorized Amount</dt>
              <dd v-if="record.authorizedAmountCents">
                {{record.authorizedAmountCents | dollar}}
              </dd>

              <dt v-if="record.paidAmountCents">Paid Amount</dt>
              <dd v-if="record.paidAmountCents">
                {{record.paidAmountCents | dollar}}
              </dd>

              <dt v-if="record.refundedAmountCents">Refunded Amount</dt>
              <dd v-if="record.refundedAmountCents">
                {{record.refundedAmountCents | dollar}}
              </dd>
            </dl>
          </div>
        </div>

        <div class="block-title">
          <h3>Refunds</h3>

          <span v-if="canRefund" class="block-title-actions pull-right">
            <a href="javascript:;">
              <icon name="plus" scale="0.8" class="v-middle"></icon>
              <span>Add</span>
            </a>
          </span>
        </div>

        <div class="block">
          <div class="block-body full">
            <el-table :data="record.refunds" stripe class="block-table" :show-header="false" style="width: 100%">
              <el-table-column width="300">
                <template scope="scope">
                  <span>{{scope.row.amountCents | dollar}}</span>
                </template>
              </el-table-column>

              <el-table-column>
                <template scope="scope">
                  <p class="text-right">
                    {{scope.row.insertedAt}}
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="block-footer text-center">
            <a class="view-more" href="#">View More</a>
          </div>
        </div>

        <div class="block-title">
          <h3>Custom Data</h3>
        </div>
        <div class="block">
          <div class="block-body">
            {{record.customData}}
          </div>
        </div>

        <h3>Related Resources</h3>
        <div class="block">
          <div class="block-body">
            <dl>
              <dt>Order</dt>
              <dd>
                <router-link :to="{ name: 'ShowOrder', params: { id: record.order.id }}">
                  {{record.order.id}}
                </router-link>
              </dd>
            </dl>
          </div>
        </div>

        <h3>Logs</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>

        <h3>Events</h3>
        <div class="block">
          <div class="block-body">

          </div>
        </div>
      </div>

      <div class="footer text-right">
        <delete-button @confirmed="deleteRecord" size="small">Delete</delete-button>
      </div>
    </el-card>
  </div>
</div>

</template>

<script>
// import _ from 'lodash'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/plus'

import ShowPage from '@/mixins/show-page'
import DeleteButton from '@/components/delete-button'
import { chargeDollar, dollar } from '@/helpers/filters'

export default {
  name: 'ShowPayment',
  components: {
    DeleteButton
  },
  filters: {
    chargeDollar,
    dollar
  },
  mixins: [ShowPage({ storeNamespace: 'payment', name: 'Payment', include: 'refunds' })],
  computed: {
    briefAmountCents () {
      if (this.record.paidAmountCents) {
        return this.record.paidAmountCents
      }

      if (this.record.authorizedAmountCents) {
        return this.record.authorizedAmountCents
      }

      if (this.record.pendingAmountCents) {
        return this.record.pendingAmountCents
      }
    },
    canRefund () {
      return this.record.status === 'paid' || this.record.status === 'partially_refunded'
    }
  },
  methods: {
    editRecord () {
      this.$store.dispatch('pushRoute', { name: 'EditProductItem', params: { id: this.record.id }, query: { callbackPath: this.currentRoutePath } })
    },
    recordDeleted () {
      this.$store.dispatch('product/resetRecord')
      this.$store.dispatch('popRoute', 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
